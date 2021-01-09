export const environment = {
  /**
   * Production build?
   * type: boolean
   */
  production: false,

  /**
   * Tumblr API Key
   * type: string
   */
  apiKey: '',

  /**
   * Tumblr Blog URL
   * type: string
   */
  apiUrl: '',

  /**
   * About component (HTML code)
   * type: string
   */
  about: `
    <h1>About</h1>
    <p>Test</p>
  `,

  /**
   * Archive menu item visibility
   */
  archive: false,

  /**
   * Copyright text
   * type: string
   */
  copyright: '',

  /**
   * Social media names to show links in menu
   * type: string object
   */
  social: {
    facebook: '',
    github: '',
    instagram: '',
    snapchat: '',
    tiktok: '',
    twitch: '',
    twitter: ''
  }
};
