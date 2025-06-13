import { prisma } from '@/lib/prisma'

/**
 * Script de purge CRON pour supprimer définitivement les comptes 
 * marqués comme supprimés depuis plus de 30 jours (RGPD-compliant)
 */
export async function cleanupDeletedUsers() {
  console.log('🧹 Début de la purge des comptes supprimés...')
  
  try {
    // Date limite : 30 jours avant aujourd'hui
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    // Recherche des utilisateurs à purger définitivement
    const usersToDelete = await prisma.user.findMany({
      where: {
        active: false,
        deletedAt: {
          lte: thirtyDaysAgo // Supprimés il y a plus de 30 jours
        }
      },
      select: {
        id: true,
        email: true,
        deletedAt: true,
        name: true
      }
    })

    console.log(`📊 ${usersToDelete.length} compte(s) à purger définitivement`)

    if (usersToDelete.length === 0) {
      console.log('✅ Aucun compte à purger')
      return {
        success: true,
        deletedCount: 0,
        message: 'Aucun compte à purger'
      }
    }

    // Purge définitive compte par compte
    let deletedCount = 0
    const errors: Array<{userId: string, error: string}> = []

    for (const user of usersToDelete) {
      try {
        console.log(`🗑️  Purge définitive du compte: ${user.email} (supprimé le ${user.deletedAt?.toISOString()})`)

        // 1. Suppression des données liées (relations)
        await prisma.$transaction(async (tx) => {
          // Suppression des logs d'authentification
          await tx.authenticationLog.deleteMany({
            where: { userId: user.id }
          })

          // Suppression des demandes d'export
          await tx.dataExportRequest.deleteMany({
            where: { userId: user.id }
          })

          // Suppression des consentements
          await tx.dataProcessingConsent.deleteMany({
            where: { userId: user.id }
          })

          // Suppression des sessions
          await tx.session.deleteMany({
            where: { userId: user.id }
          })

          // Suppression des comptes OAuth
          await tx.account.deleteMany({
            where: { userId: user.id }
          })

          // Les commandes sont conservées mais userId mis à null (audit)
          await tx.order.updateMany({
            where: { userId: user.id },
            data: { userId: null }
          })

          // Les articles de blog sont transférés à un utilisateur système ou supprimés
          // (selon la politique business)
          await tx.blogPost.deleteMany({
            where: { authorId: user.id }
          })

          // Enfin, suppression de l'utilisateur
          await tx.user.delete({
            where: { id: user.id }
          })
        })

        deletedCount++
        console.log(`✅ Compte ${user.email} purgé avec succès`)

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        console.error(`❌ Erreur lors de la purge du compte ${user.email}:`, errorMessage)
        errors.push({
          userId: user.id,
          error: errorMessage
        })
      }
    }

    // Log final de l'opération
    console.log(`🎯 Purge terminée: ${deletedCount}/${usersToDelete.length} comptes supprimés`)
    
    if (errors.length > 0) {
      console.error(`⚠️  ${errors.length} erreur(s) rencontrée(s):`, errors)
    }

    return {
      success: true,
      deletedCount,
      totalFound: usersToDelete.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `${deletedCount} compte(s) purgé(s) définitivement`
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('💥 Erreur fatale lors de la purge:', errorMessage)
    
    return {
      success: false,
      deletedCount: 0,
      error: errorMessage,
      message: 'Erreur lors de la purge'
    }
  }
}

/**
 * Script de nettoyage des tokens expirés et sessions anciennes
 */
export async function cleanupExpiredTokens() {
  console.log('🧹 Nettoyage des tokens expirés...')
  
  try {
    const now = new Date()
    
    // Suppression des tokens de vérification expirés
    const expiredVerificationTokens = await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: now
        }
      }
    })

    // Suppression des tokens de reset de mot de passe expirés
    const expiredPasswordTokens = await prisma.passwordResetToken.deleteMany({
      where: {
        expires: {
          lt: now
        }
      }
    })

    // Suppression des sessions anciennes (plus de 90 jours)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    const oldSessions = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: ninetyDaysAgo
        }
      }
    })

    // Suppression des exports de données expirés
    const expiredExports = await prisma.dataExportRequest.deleteMany({
      where: {
        status: 'COMPLETED',
        expiresAt: {
          lt: now
        }
      }
    })

    console.log(`✅ Nettoyage terminé:`)
    console.log(`   - ${expiredVerificationTokens.count} tokens de vérification expirés`)
    console.log(`   - ${expiredPasswordTokens.count} tokens de reset expirés`) 
    console.log(`   - ${oldSessions.count} sessions anciennes`)
    console.log(`   - ${expiredExports.count} exports expirés`)

    return {
      success: true,
      cleaned: {
        verificationTokens: expiredVerificationTokens.count,
        passwordTokens: expiredPasswordTokens.count,
        sessions: oldSessions.count,
        exports: expiredExports.count
      }
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('💥 Erreur lors du nettoyage des tokens:', errorMessage)
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Fonction principale de nettoyage (à appeler par CRON)
 */
export async function runScheduledCleanup() {
  console.log('🚀 Démarrage du nettoyage programmé...')
  console.log(`⏰ ${new Date().toISOString()}`)
  
  const results = {
    startTime: new Date().toISOString(),
    userCleanup: await cleanupDeletedUsers(),
    tokenCleanup: await cleanupExpiredTokens(),
    endTime: ''
  }
  
  results.endTime = new Date().toISOString()
  
  console.log('🏁 Nettoyage programmé terminé')
  console.log('📊 Résultats:', JSON.stringify(results, null, 2))
  
  return results
} 