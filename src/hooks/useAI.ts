import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery } from "@tanstack/react-query";

interface ChatRequest {
   messages: Array<{ role: string; content: string }>;
   course_id?: string;
}

interface StudyRequest extends ChatRequest {}
interface LearningRequest extends ChatRequest {}

interface ContentSummaryRequest {
   content: string;
   detail_level: string;
   focus_areas?: string[];
}

interface ConceptExplanationRequest {
   concept: string;
   context?: string;
   difficulty_level: string;
}

interface QuizAttempt {
   quiz_id: string;
   answers: Array<{ question_id: string; answer: string }>;
}

interface DocumentAnalysisResponse {
   material_id: string;
   title: string;
   content: string;
   course_id: string;
}

interface AIResponse {
   response: string;
   session_id: string;
}

interface ContentSummaryResponse {
   summary: string;
   key_points: string[];
   suggested_topics: string[];
}

interface ConceptExplanationResponse {
   explanation: string;
   examples: string[];
   related_concepts: string[];
   practice_questions?: Array<{
      question: string;
      options?: string[];
      answer?: string;
      explanation?: string;
   }>;
}

// API call functions
const chatWithAI = async (request: ChatRequest): Promise<AIResponse> => {
   try {
      const response = await handleApiRequest(() =>
         authorizedAPI.post("/ai/chat", request)
      );
      return response.data;
   } catch (error) {
      console.error("AI Chat Error:", error);
      throw new Error("Failed to get AI response");
   }
};

const generateQuiz = (courseId: string): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.post(`/ai/generate-quiz/${courseId}`)
   );
};

const submitQuiz = (quizAttempt: QuizAttempt): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.post("/ai/submit-quiz", quizAttempt)
   );
};

const analyzeCourse = (courseId: string): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.post(`/ai/analyze-course/${courseId}`)
   );
};

const summarizeContent = (request: ContentSummaryRequest): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.post("/ai/summarize", request));
};

const explainConcept = (request: ConceptExplanationRequest): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.post("/ai/explain-concept", request)
   );
};

const studyChat = (request: StudyRequest): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.post("/ai/study-chat", request));
};

const aiLearning = (request: LearningRequest): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.post("/ai/chat", request));
};

const extractDocumentText = (
   materialId: string
): Promise<DocumentAnalysisResponse> => {
   return handleApiRequest(() =>
      authorizedAPI.post(`/ai/extract-document-text/${materialId}`)
   );
};

// React Query Hooks
export const useChatWithAI = () => {
   return useMutation<AIResponse, Error, ChatRequest>({
      mutationFn: chatWithAI,
      onError: (error) => {
         console.error("Chat mutation error:", error);
      },
   });
};

export const useGenerateQuiz = () => {
   return useMutation<any, Error, string>({
      mutationFn: generateQuiz,
   });
};

export const useSubmitQuiz = () => {
   return useMutation<any, Error, QuizAttempt>({
      mutationFn: submitQuiz,
   });
};

export const useAnalyzeCourse = () => {
   return useMutation<any, Error, string>({
      mutationFn: analyzeCourse,
   });
};

export const useSummarizeContent = () => {
   return useMutation<any, Error, ContentSummaryRequest>({
      mutationFn: summarizeContent,
   });
};

export const useExplainConcept = () => {
   return useMutation<any, Error, ConceptExplanationRequest>({
      mutationFn: explainConcept,
   });
};

export const useStudyChat = () => {
   return useMutation<any, Error, StudyRequest>({
      mutationFn: studyChat,
   });
};

export const useAILearning = () => {
   return useMutation<any, Error, LearningRequest>({
      mutationFn: aiLearning,
   });
};

export const useExtractDocumentText = () => {
   return useMutation<DocumentAnalysisResponse, Error, string>({
      mutationFn: extractDocumentText,
   });
};
