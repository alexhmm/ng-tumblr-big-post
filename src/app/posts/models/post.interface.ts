/**
 * Tumblr Post interface
 */
export interface Post {
  /**
   * Blog object
   */
  blog: {
    description: string;
    name: string;
    title: string;
    updated: number;
    url: string;
    uuid: string;
  };
  /**
   * Blog name
   */
  blog_name: string;
  /**
   * Can like
   */
  can_like: boolean;
  /**
   * Can reblog
   */
  can_reblog: boolean;
  /**
   * Can replay
   */
  can_reply: boolean;
  /**
   * Can send in message
   */
  can_send_in_message: boolean;
  /**
   * Caption
   */
  caption: string;
  /**
   * Date
   */
  date: string;
  /**
   * Display avatar
   */
  display_avatar: true;
  /**
   * Format
   */
  format: string;
  /**
   * Id
   */
  id: number;
  /**
   * ID string
   */
  id_string: string;
  /**
   * Image permalink
   */
  image_permalink: string;
  /**
   * Note count
   */
  note_count: number;
  /**
   * Photos
   */
  photos: any[];
  /**
   * Post URL
   */
  post_url: string;
  /**
   * Reblog
   */
  reblog: {
    comment: string;
    tree_html: string;
  };
  /**
   * Reblog key
   */
  reblog_key: string;
  /**
   * Recommended color
   */
  recommended_color: any;
  /**
   * Recommended source
   */
  recommended_source: any;
  /**
   * Short url
   */
  short_url: string;
  /**
   * Should open in legacy
   */
  should_open_in_legacy: boolean;
  /**
   * Slug
   */
  slug: string;
  /**
   * State
   */
  state: string;
  /**
   * Summary
   */
  summary: string;
  /**
   * Tags
   */
  tags: string[];
  /**
   * Timestamp
   */
  timestamp: number;
  /**
   * Trail
   */
  trail: any[];
  /**
   * Type
   */
  type: string;
}
