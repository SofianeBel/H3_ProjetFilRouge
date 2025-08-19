declare module '@testing-library/user-event' {
  export interface UserEventAPI {
    setup(): UserEventAPI
    click(element: Element): Promise<void>
    type(element: Element, text: string): Promise<void>
    clear(element: Element): Promise<void>
    selectOptions(element: Element, values: string | string[]): Promise<void>
    tab(): Promise<void>
  }
  
  const userEvent: UserEventAPI
  export default userEvent
}
