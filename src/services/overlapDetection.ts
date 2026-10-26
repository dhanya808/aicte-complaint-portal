import { ComplaintCase, Institution, OverlapGroup } from '../types';

/**
 * Normalizes an institution name by stripping common abbreviations and suffixes
 */
export function normalizeInstitutionName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\binst\b|\binstitute\b/g, 'institute')
    .replace(/\bengg\b|\beng\b|\bengineering\b/g, 'engineering')
    .replace(/\btech\b|\btechnology\b/g, 'technology')
    .replace(/\bmgmt\b|\bmanagement\b/g, 'management')
    .replace(/\bcoll\b|\bcollege\b/g, 'college')
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes Levenshtein Distance similarity ratio (0.0 to 1.0)
 */
export function stringSimilarity(s1: string, s2: string): number {
  const str1 = normalizeInstitutionName(s1);
  const str2 = normalizeInstitutionName(s2);
  
  if (str1 === str2) return 1.0;
  if (!str1.length || !str2.length) return 0.0;

  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null)
  );

  for (let i = 0; i <= str1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= str2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = track[str2.length][str1.length];
  const maxLength = Math.max(str1.length, str2.length);
  return 1.0 - distance / maxLength;
}

/**
 * Tri-Level Cross-Bureau Overlap Detection Engine
 */
export function detectOverlaps(
  cases: ComplaintCase[],
  institutions: Institution[]
): OverlapGroup[] {
  const overlaps: OverlapGroup[] = [];
  const processedPairs = new Set<string>();

  // Compare every case against others from different bureaus
  for (let i = 0; i < cases.length; i++) {
    for (let j = i + 1; j < cases.length; j++) {
      const caseA = cases[i];
      const caseB = cases[j];

      // Exclude cases from the same bureau or already disposed cases
      if (caseA.assignedBureau === caseB.assignedBureau) continue;
      if (caseA.status === 'DISPOSED' && caseB.status === 'DISPOSED') continue;

      const pairKey = [caseA.id, caseB.id].sort().join('::');
      if (processedPairs.has(pairKey)) continue;
      processedPairs.add(pairKey);

      let isMatch = false;
      let matchType: 'EXACT_PERMANENT_ID' | 'FUZZY_NAME_ADDRESS' | 'SEMANTIC_ISSUE_SIMILARITY' = 'EXACT_PERMANENT_ID';
      let confidence = 0;
      let reason = '';

      // Level 1: Exact AICTE Permanent ID Match
      if (
        caseA.institutionPermanentId &&
        caseB.institutionPermanentId &&
        caseA.institutionPermanentId === caseB.institutionPermanentId
      ) {
        isMatch = true;
        matchType = 'EXACT_PERMANENT_ID';
        confidence = 98;
        reason = `Exact AICTE Permanent ID Match (${caseA.institutionPermanentId}). Dual proceedings active in ${caseA.assignedBureau} and ${caseB.assignedBureau}.`;
      } 
      // Level 2: Fuzzy Name & Location Matching
      else {
        const nameSim = stringSimilarity(caseA.institutionName, caseB.institutionName);
        const sameRegion = caseA.institutionRegion === caseB.institutionRegion;
        const sameState = caseA.institutionState.toLowerCase() === caseB.institutionState.toLowerCase();

        if (nameSim >= 0.72 && (sameRegion || sameState)) {
          isMatch = true;
          matchType = 'FUZZY_NAME_ADDRESS';
          confidence = Math.round(nameSim * 100);
          reason = `Fuzzy Entity Correlation (${confidence}% match): "${caseA.institutionName}" (${caseA.assignedBureau}) matches "${caseB.institutionName}" (${caseB.assignedBureau}) in ${caseA.institutionState}.`;
        }
      }

      // Level 3: Semantic Issue Cross-Correlation
      const facultyIssues = ['SALARY_NON_PAYMENT', 'FACULTY_IRREGULARITIES'];
      const studentFeeIssues = ['FEE_OVERCHARGE', 'CERTIFICATE_WITHHELD', 'UNAPPROVED_COURSE'];
      
      const isFacultyCrossIssue = facultyIssues.includes(caseA.category) && facultyIssues.includes(caseB.category);
      const isFeeAdmissionCross = studentFeeIssues.includes(caseA.category) && studentFeeIssues.includes(caseB.category);

      if (isMatch) {
        if (isFacultyCrossIssue) {
          confidence = Math.min(100, confidence + 2);
          reason += ' High-risk correlation: Faculty payroll grievance aligns with regulatory audit of faculty cadre.';
        } else if (isFeeAdmissionCross) {
          confidence = Math.min(100, confidence + 2);
          reason += ' Correlated concern: Student fee grievance correlates with unapproved intake inquiry.';
        }

        overlaps.push({
          id: `OVL-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          institutionPermanentId: caseA.institutionPermanentId || caseB.institutionPermanentId,
          institutionName: caseA.institutionName,
          region: caseA.institutionRegion,
          riskScore: confidence > 90 ? 92 : 75,
          caseIds: [caseA.id, caseB.id],
          bureauInvolved: [caseA.assignedBureau, caseB.assignedBureau],
          matchType,
          confidence,
          alertDate: new Date().toISOString().split('T')[0],
          summary: reason,
          status: 'DETECTED',
          jointNotes: []
        });
      }
    }
  }

  return overlaps;
}
