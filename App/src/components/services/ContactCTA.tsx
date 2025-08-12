import Link from 'next/link'

export default function ContactCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#6B8DE5] to-[#A67FFB]">
      <div className="container-cyna text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Parlons de votre projet</h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          Nos experts vous accompagnent pour définir la meilleure stratégie de cybersécurité.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/booking?mode=booking" className="bg-white text-[#6B8DE5] font-semibold px-6 py-3 rounded-md hover:bg-gray-100">
            Demander une consultation
          </Link>
          <Link href="/contact" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-[#6B8DE5]">
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  )
}
