/**
 * CV Rewriter Service
 *
 * This module provides functionality to rewrite a CV based on a job description.
 * It uses either a mock implementation or connects to an actual LLM service.
 */

import { CvData } from '../cv-parser/cv-parser';
import { optimizeCvForJob } from '../api/anthropic';

export interface RewriteRequest {
  cv: CvData;
  jobDescription: string;
}

export interface RewriteResponse {
  originalCv: CvData;
  rewrittenCv: CvData;
  jobDescription: string;
  matches: {
    skills: string[];
    experience: string[];
  };
  improvements: string[];
}

/**
 * Main function to rewrite a CV based on a job description
 * Now supports LLM-powered optimization
 */
export async function rewriteCV(
  cvData: CvData,
  jobDescription: string,
  useLLM = true,
): Promise<RewriteResponse> {
  console.log('Rewriting CV for job description:', jobDescription);

  try {
    // Use LLM-powered optimization if enabled
    if (useLLM && process.env.ANTHROPIC_API_KEY) {
      console.log('Using LLM for CV optimization');
      return await rewriteCVWithLLM(cvData, jobDescription);
    } else {
      // Fall back to the rule-based approach
      console.log('Using rule-based CV optimization');
      return await rewriteCVWithRules(cvData, jobDescription);
    }
  } catch (error) {
    console.error('Error in CV rewriting:', error);
    // Fall back to rule-based approach if LLM fails
    return await rewriteCVWithRules(cvData, jobDescription);
  }
}

/**
 * LLM-powered CV rewriting using Anthropic API
 */
async function rewriteCVWithLLM(
  cvData: CvData,
  jobDescription: string,
): Promise<RewriteResponse> {
  // Log the original CV data for debugging
  console.log('Original CV summary:', cvData.summary);

  // Get recommendations from the LLM
  const recommendations = await optimizeCvForJob(cvData, jobDescription);

  // Log the recommendations for debugging
  console.log(
    'Received recommendations for summary:',
    recommendations.summaryImprovement ? 'Yes' : 'No',
  );

  // Create a deep copy of the original CV to modify
  const rewrittenCv: CvData = JSON.parse(JSON.stringify(cvData));

  // Apply summary improvements if available
  if (recommendations.summaryImprovement) {
    rewrittenCv.summary = recommendations.summaryImprovement;
    console.log(
      'Applied new summary:',
      rewrittenCv.summary.substring(0, 50) + '...',
    );
  } else {
    console.log('No summary improvements received, keeping original summary');
  }

  // Apply work experience improvements
  if (recommendations.workExperienceRecommendations) {
    // For each work experience that has recommendations
    recommendations.workExperienceRecommendations.forEach((rec) => {
      // Find matching work experience entry
      const matchingExp = rewrittenCv.workExperience.find(
        (exp) => exp.company === rec.company && exp.position === rec.position,
      );

      // Apply improvements to responsibilities if the entry was found
      if (matchingExp && rec.improvements.length > 0) {
        // Add new responsibilities while preserving existing ones
        const existingResponsibilities = new Set(
          matchingExp.responsibilities || [],
        );
        rec.improvements.forEach((improvement) => {
          if (!existingResponsibilities.has(improvement)) {
            if (!matchingExp.responsibilities) {
              matchingExp.responsibilities = [];
            }
            matchingExp.responsibilities.push(improvement);
          }
        });
      }
    });
  }

  // Apply skills recommendations
  if (recommendations.skillsRecommendations) {
    // Add new skills
    recommendations.skillsRecommendations.add.forEach((skillName) => {
      const exists = rewrittenCv.skills.some(
        (s) => s.name.toLowerCase() === skillName.toLowerCase(),
      );

      if (!exists) {
        rewrittenCv.skills.push({ name: skillName });
      }
    });

    // Emphasize existing skills by adding levels
    recommendations.skillsRecommendations.emphasize.forEach((skillName) => {
      const skill = rewrittenCv.skills.find(
        (s) => s.name.toLowerCase() === skillName.toLowerCase(),
      );

      if (skill && !skill.level) {
        skill.level = 'Advanced';
      }
    });
  }

  // Return the rewrite response
  return {
    originalCv: cvData,
    rewrittenCv,
    jobDescription,
    matches: {
      skills: recommendations.skillsRecommendations.emphasize || [],
      experience:
        recommendations.workExperienceRecommendations.map((r) => r.company) ||
        [],
    },
    improvements: recommendations.overallSuggestions || [],
  };
}

/**
 * Original rule-based CV rewriting
 * Kept for backward compatibility and as a fallback
 */
async function rewriteCVWithRules(
  cvData: CvData,
  jobDescription: string,
): Promise<RewriteResponse> {
  // Create a deep copy of the original CV to modify
  const rewrittenCv: CvData = JSON.parse(JSON.stringify(cvData));

  // Extract keywords from job description
  const keywords = extractKeywords(jobDescription);

  // Find matching skills and experience
  const matches = findMatches(cvData, keywords);

  // Enhance the CV based on job description
  enhanceSummary(rewrittenCv, jobDescription, keywords);
  enhanceWorkExperience(rewrittenCv, keywords);
  enhanceSkills(rewrittenCv, keywords, matches.skills);

  // Generate improvement suggestions
  const improvements = generateImprovements(cvData, jobDescription, keywords);

  // Return the rewrite response
  return {
    originalCv: cvData,
    rewrittenCv,
    jobDescription,
    matches,
    improvements,
  };
}

/**
 * Extracts keywords from a job description.
 */
function extractKeywords(jobDescription: string): string[] {
  // List of common keywords to look for in job descriptions
  const commonKeywords = [
    'javascript',
    'typescript',
    'react',
    'node',
    'next.js',
    'html',
    'css',
    'tailwind',
    'api',
    'rest',
    'graphql',
    'database',
    'sql',
    'nosql',
    'mongodb',
    'postgresql',
    'frontend',
    'backend',
    'fullstack',
    'cloud',
    'aws',
    'azure',
    'gcp',
    'agile',
    'scrum',
    'kanban',
    'ci/cd',
    'git',
    'github',
    'testing',
    'unit test',
    'integration test',
    'mobile',
    'responsive',
    'ui/ux',
    'design',
    'project management',
  ];

  // Extract keywords from job description
  const words = jobDescription.toLowerCase().split(/\W+/);

  // Find common keywords in the job description
  return commonKeywords.filter(
    (keyword) =>
      words.includes(keyword) || jobDescription.toLowerCase().includes(keyword),
  );
}

/**
 * Finds matches between CV and job description keywords.
 */
function findMatches(
  cv: CvData,
  keywords: string[],
): { skills: string[]; experience: string[] } {
  const skills: string[] = [];
  const experience: string[] = [];

  // Find matching skills
  cv.skills.forEach((skill) => {
    if (
      keywords.some(
        (keyword) =>
          skill.name.toLowerCase().includes(keyword) ||
          keywords.some((k) => k.includes(skill.name.toLowerCase())),
      )
    ) {
      skills.push(skill.name);
    }
  });

  // Find matching experience
  cv.workExperience.forEach((job) => {
    if (job.responsibilities) {
      // Check if responsibilities exist
      job.responsibilities.forEach((resp) => {
        if (keywords.some((keyword) => resp.toLowerCase().includes(keyword))) {
          const matchedKeyword = keywords.find((keyword) =>
            resp.toLowerCase().includes(keyword),
          );
          if (matchedKeyword && !experience.includes(matchedKeyword)) {
            experience.push(matchedKeyword);
          }
        }
      });
    }
  });

  return { skills, experience };
}

/**
 * Enhances the CV summary based on job description.
 */
function enhanceSummary(
  cv: CvData,
  jobDescription: string,
  keywords: string[],
): void {
  // Generate a summary if none exists
  if (!cv.summary) {
    cv.summary = `Experienced professional with skills in ${keywords.slice(0, 3).join(', ')}.`;
    return;
  }

  // Enhance existing summary
  const existingSummary = cv.summary;
  const jobTitle = extractJobTitle(jobDescription);

  // Add job title and keywords to summary if not already present
  if (jobTitle && !existingSummary.includes(jobTitle)) {
    cv.summary =
      existingSummary.replace(/\.$/, '') +
      ` seeking a ${jobTitle} role where skills in ${keywords.slice(0, 3).join(', ')} can be utilized.`;
  } else {
    // Just add keywords if job title extraction failed or is already in summary
    cv.summary =
      existingSummary.replace(/\.$/, '') +
      ` Proficient in ${keywords.slice(0, 3).join(', ')}.`;
  }
}

/**
 * Attempts to extract a job title from the job description.
 */
function extractJobTitle(jobDescription: string): string | null {
  // Common job titles to look for
  const commonTitles = [
    'software engineer',
    'frontend developer',
    'backend developer',
    'fullstack developer',
    'web developer',
    'ux designer',
    'project manager',
    'product manager',
    'data scientist',
    'devops engineer',
    'qa engineer',
    'systems architect',
  ];

  // Find a title in the job description
  const lowerDesc = jobDescription.toLowerCase();
  return commonTitles.find((title) => lowerDesc.includes(title)) || null;
}

/**
 * Enhances work experience bullet points to highlight relevant skills.
 */
function enhanceWorkExperience(cv: CvData, keywords: string[]): void {
  cv.workExperience.forEach((job) => {
    if (job.responsibilities) {
      // Check if responsibilities exist
      job.responsibilities = job.responsibilities.map((responsibility) => {
        // Look for keywords in the responsibility
        const matchedKeyword = keywords.find((keyword) =>
          responsibility.toLowerCase().includes(keyword),
        );

        if (matchedKeyword) {
          // Emphasize the matched keyword
          const pattern = new RegExp(matchedKeyword, 'i');
          return responsibility.replace(
            pattern,
            (match) => `${match} (key skill for this role)`,
          );
        }

        return responsibility;
      });
    }
  });
}

/**
 * Enhances skills section by adding levels to matching skills.
 */
function enhanceSkills(
  cv: CvData,
  keywords: string[],
  matchingSkills: string[],
): void {
  cv.skills.forEach((skill) => {
    if (matchingSkills.includes(skill.name)) {
      // Add proficiency level to matching skills if not present
      if (!skill.level) {
        skill.level = 'Advanced';
      }
    }
  });
}

/**
 * Generates improvement suggestions based on job description and CV.
 */
function generateImprovements(
  cv: CvData,
  jobDescription: string,
  keywords: string[],
): string[] {
  const improvements: string[] = [];

  // Check for missing skills
  const missingSkills = keywords.filter(
    (keyword) =>
      !cv.skills.some(
        (skill) =>
          skill.name.toLowerCase().includes(keyword) ||
          keyword.includes(skill.name.toLowerCase()),
      ),
  );

  if (missingSkills.length > 0) {
    improvements.push(
      `Consider adding these skills to your CV: ${missingSkills.join(', ')}`,
    );
  }

  // Check if summary is missing or too short
  if (!cv.summary || cv.summary.split(' ').length < 10) {
    improvements.push(
      'Add a more detailed professional summary highlighting your experience and skills',
    );
  }

  // Check for quantifiable achievements
  const hasQuantifiableAchievements = cv.workExperience.some((job) =>
    job.responsibilities
      ? job.responsibilities.some((resp) =>
          /\d+%|\d+ percent|increased|decreased|improved|reduced|generated|saved|managed \d+/i.test(
            resp,
          ),
        )
      : false,
  );

  if (!hasQuantifiableAchievements) {
    improvements.push(
      'Add quantifiable achievements to your work experience (e.g., "Increased sales by 20%")',
    );
  }

  // Always suggest adding more specific examples
  improvements.push(
    'Include specific examples of projects related to ' +
      keywords.slice(0, 3).join(', '),
  );

  return improvements;
}
