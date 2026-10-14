/**
 * Customer reviews on the storefront (Judge.me widget on the PDP, and the
 * Judge.me storefront scripts that power it).
 *
 * Off until reviews come from verified buyers (owner, 2026-10-13). With the
 * widget off nothing uses the scripts, so they are not loaded either, which
 * also keeps Judge.me's rating data off the page. Review-request emails are
 * sent by Judge.me through Shopify and do not depend on this.
 *
 * To turn reviews back on, set this to true.
 */
export const REVIEWS_ENABLED = false;
