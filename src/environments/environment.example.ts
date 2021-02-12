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
   * Copyright text
   * type: string
   */
  copyright: '',

  /**
   * Favicon link
   * type: string
   */
  favicon: '',

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
  },
  /**
   * Display state for various elements
   * type: boolean object
   */
  state: {
    menu: {
      /**
       * Display state for archive menu item
       */
      archive: false
    },
    posts: {
      /**
       * Display state for tags in post caption
       */
      tags: false
    }
  }
};
