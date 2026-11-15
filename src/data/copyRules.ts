// Claims the site may not make without owner-supplied proof: counts with a plus, project/client/year/country
// tallies, awards, guarantees, prices and boast words. Tests run every data file's copy against it.
export const INVENTED_PROOF =
  /\d+\+|\b\d+ (projects|clients|years|countries)\b|\bawards?\b|\bguarantee[sd]?\b|\$\d|\b(fast(est)?|blazing|scalable|secure|24\/7|enterprise-grade|best|leading|expert|proven|world-class|cutting-edge)\b/i;
