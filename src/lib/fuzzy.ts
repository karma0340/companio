/**
 * Lightweight Fuzzy Search Engine for Companions, Cities, Areas, Hobbies & Languages
 */

function boundedLevenshtein(a: string, b: string, maxDist = 2): number {
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > maxDist) return maxDist + 1;
  if (la === 0) return lb;
  if (lb === 0) return la;

  const prev = new Array<number>(lb + 1);
  const curr = new Array<number>(lb + 1);

  for (let j = 0; j <= lb; j++) prev[j] = j;

  for (let i = 1; i <= la; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    const ca = a.charCodeAt(i - 1);

    for (let j = 1; j <= lb; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      const val = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      curr[j] = val;
      if (val < rowMin) rowMin = val;
    }

    if (rowMin > maxDist) return maxDist + 1;
    for (let j = 0; j <= lb; j++) prev[j] = curr[j];
  }

  return prev[lb];
}

function isSubsequence(needle: string, haystack: string): boolean {
  if (!needle) return true;
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j++) {
    if (needle[i] === haystack[j]) i++;
  }
  return i === needle.length;
}

/**
 * Scores a candidate record against a multi-word search query.
 * Higher score = closer match. 0 = no match.
 */
export function scoreFuzzyMatch(query: string, fields: Array<string | undefined | null>): number {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return 1;

  const tokens = cleanQuery.split(/[\s,]+/).filter(Boolean);
  if (tokens.length === 0) return 1;

  const normalizedFields = fields
    .filter((f): f is string => typeof f === "string" && f.trim().length > 0)
    .map((f) => f.toLowerCase());

  if (normalizedFields.length === 0) return 0;

  const combinedText = normalizedFields.join(" ");
  const words = combinedText.split(/[\s,.\-_/|]+/).filter((w) => w.length > 0);

  let totalScore = 0;

  for (const token of tokens) {
    let tokenBest = 0;

    // 1. Exact full or prefix match on primary fields
    for (let idx = 0; idx < normalizedFields.length; idx++) {
      const field = normalizedFields[idx];
      const weightBoost = idx === 0 ? 15 : idx <= 2 ? 8 : 2;
      if (field === token) {
        tokenBest = Math.max(tokenBest, 100 + weightBoost);
      } else if (field.startsWith(token)) {
        tokenBest = Math.max(tokenBest, 80 + weightBoost);
      } else if (field.includes(token)) {
        tokenBest = Math.max(tokenBest, 60 + weightBoost);
      }
    }

    // 2. Word-level fuzzy Levenshtein / prefix match (handles typos like "coffe", "chandigrh", "badmnton")
    if (tokenBest === 0 && token.length >= 3) {
      const maxTypos = token.length >= 6 ? 2 : 1;
      for (const word of words) {
        if (word.startsWith(token)) {
          tokenBest = Math.max(tokenBest, 55);
          break;
        }
        const slice = word.slice(0, Math.min(word.length, token.length + maxTypos));
        const dist = boundedLevenshtein(token, word, maxTypos);
        const prefixDist = boundedLevenshtein(token, slice, maxTypos);
        const bestDist = Math.min(dist, prefixDist);
        if (bestDist <= maxTypos) {
          tokenBest = Math.max(tokenBest, 45 - bestDist * 12);
        }
      }
    }

    // 3. Ordered subsequence fallback (e.g. "cfch" -> "coffee chat", "chd" -> "chandigarh")
    if (tokenBest === 0 && token.length >= 3) {
      for (const field of normalizedFields) {
        if (isSubsequence(token, field)) {
          tokenBest = Math.max(tokenBest, 20);
          break;
        }
      }
    }

    if (tokenBest === 0) {
      return 0; // All tokens must match to avoid noisy unrelated results
    }

    totalScore += tokenBest;
  }

  return totalScore;
}
