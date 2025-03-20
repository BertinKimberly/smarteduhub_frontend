//@ts-nocheck
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Loader2,
   BookOpen,
   Brain,
   MessageSquare,
   FileQuestion,
   ListChecks,
   Send,
} from "lucide-react";
import {
   useAILearning,
   useSummarizeContent,
   useExplainConcept,
   useGenerateQuiz,
} from "@/hooks/useAI";
import { ChatHistory } from "@/components/ChatHistory";
import { useChatHistory } from "@/hooks/useChatHistory";
import MessageBubble from "@/components/MessageBubble";

interface AIAnalysisPanelProps {
   materialId: string;
   materialTitle: string;
   courseId: string;
   content: string;
   onClose: () => void;
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
   materialId,
   materialTitle,
   courseId,
   content,
   onClose,
}) => {
   const [activeTab, setActiveTab] = useState("summarize");
   const [chatMessages, setChatMessages] = useState<
      Array<{ role: string; content: string }>
   >([]);
   const [currentMessage, setCurrentMessage] = useState("");
   const [concept, setConcept] = useState("");
   const [difficultyLevel, setDifficultyLevel] = useState("intermediate");
   const [detailLevel, setDetailLevel] = useState("medium");
   const [focusArea, setFocusArea] = useState("");

   // AI hooks
   const aiLearning = useAILearning();
   const summarizeContent = useSummarizeContent();
   const explainConcept = useExplainConcept();
   const generateQuiz = useGenerateQuiz();
   const { createSession } = useChatHistory();

   // Handle chat submission
   const handleChatSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentMessage.trim() || aiLearning.isPending) return;

      const newMessage = { role: "user", content: currentMessage };
      const updatedMessages = [...chatMessages, newMessage];
      setChatMessages(updatedMessages);
      setCurrentMessage("");

      try {
         const response = await aiLearning.mutateAsync({
            messages: [
               {
                  role: "system",
                  content: `You are analyzing the course material: ${materialTitle}. The content is:\n\n${content}\n\nPlease help the student understand this material.`,
               },
               ...updatedMessages,
            ],
         });

         if (response && response.response) {
            const newMessages = [
               ...updatedMessages,
               { role: "assistant", content: response.response },
            ];
            setChatMessages(newMessages);

            // Create chat session
            await createSession({
               messages: newMessages,
               session_type: "material_analysis",
               title: `Analysis: ${materialTitle}`,
            });
         }
      } catch (error) {
         console.error("Error in AI chat:", error);
         setChatMessages([
            ...updatedMessages,
            {
               role: "assistant",
               content: "Sorry, I encountered an error. Please try again.",
            },
         ]);
      }
   };

   // Handle summarize content
   const handleSummarize = async () => {
      try {
         const response = await summarizeContent.mutateAsync({
            content: content,
            detail_level: detailLevel,
            focus_areas: focusArea ? [focusArea] : undefined,
         });

         // Format the response for chat display
         const formattedSummary = `Here's a ${detailLevel} summary of ${materialTitle}:

${response.summary}

Key Points:
${response.key_points.map((point) => `• ${point}`).join("\n")}

Suggested Topics to Explore:
${response.suggested_topics.map((topic) => `• ${topic}`).join("\n")}`;

         setChatMessages([
            { role: "user", content: `Please summarize this material.` },
            { role: "assistant", content: formattedSummary },
         ]);
         setActiveTab("chat");
      } catch (error) {
         console.error("Error summarizing content:", error);
         setChatMessages([
            { role: "user", content: "Please summarize this material." },
            {
               role: "assistant",
               content:
                  "I apologize, but I encountered an error while trying to summarize the content. Please try again or try adjusting the detail level.",
            },
         ]);
         setActiveTab("chat");
      }
   };

   // Handle explain concept
   const handleExplainConcept = async () => {
      if (!concept.trim()) return;

      try {
         const response = await explainConcept.mutateAsync({
            concept,
            context: content, // Pass the full content for context
            difficulty_level: difficultyLevel,
         });

         const formattedExplanation = `Here's an explanation of "${concept}" at ${difficultyLevel} level:

${response.explanation}

Examples:
${response.examples.map((ex) => `• ${ex}`).join("\n")}

Related Concepts:
${response.related_concepts.map((rc) => `• ${rc}`).join("\n")}

${
   response.practice_questions
      ? `\nPractice Questions:\n${response.practice_questions
           .map(
              (q, i) => `
${i + 1}. ${q.question}
${
   q.options
      ? q.options
           .map((opt, j) => `   ${String.fromCharCode(65 + j)}. ${opt}`)
           .join("\n")
      : ""
}
`
           )
           .join("\n")}`
      : ""
}`;

         setChatMessages([
            { role: "user", content: `Please explain the concept: ${concept}` },
            { role: "assistant", content: formattedExplanation },
         ]);
         setActiveTab("chat");
         setConcept("");
      } catch (error) {
         console.error("Error explaining concept:", error);
         setChatMessages([
            { role: "user", content: `Please explain the concept: ${concept}` },
            {
               role: "assistant",
               content:
                  "I apologize, but I encountered an error while trying to explain this concept. Please try again or try with a different concept.",
            },
         ]);
         setActiveTab("chat");
      }
   };

   // Handle generate quiz
   const handleGenerateQuiz = async () => {
      try {
         const response = await generateQuiz.mutateAsync(courseId);

         const quizContent = `
# Quiz for ${materialTitle}

${response
   .map(
      (q, i) => `
## Question ${i + 1}
${q.question}

Options:
${q.options
   .map((opt, j) => `${String.fromCharCode(65 + j)}. ${opt}`)
   .join("\n")}

<details>
<summary>Answer</summary>
Correct answer: ${q.correct_answer}
${q.explanation ? `\nExplanation: ${q.explanation}` : ""}
</details>
`
   )
   .join("\n")}
         `;

         setChatMessages([
            {
               role: "user",
               content: `Please generate a quiz for: ${materialTitle}`,
            },
            { role: "assistant", content: quizContent },
         ]);
         setActiveTab("chat");
      } catch (error) {
         console.error("Error generating quiz:", error);
      }
   };

   return (
      <Card className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl">
         <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex justify-between items-center">
               <CardTitle className="text-xl">AI Learning Assistant</CardTitle>
               <div className="flex gap-2">
                  <ChatHistory
                     onSelectSession={(session) => {
                        setChatMessages(session.messages);
                        setActiveTab("chat");
                     }}
                  />
                  <Button
                     variant="ghost"
                     onClick={onClose}
                     className="text-white hover:text-gray-200 hover:bg-white/10"
                  >
                     Close
                  </Button>
               </div>
            </div>
            <p className="text-blue-100">Analyzing: {materialTitle}</p>
         </CardHeader>
         <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
            <Tabs
               value={activeTab}
               onValueChange={setActiveTab}
               className="flex-1 flex flex-col p-6"
            >
               <TabsList className="mb-4">
                  <TabsTrigger
                     value="summarize"
                     className="flex items-center gap-2"
                  >
                     <BookOpen className="h-4 w-4" />
                     Summarize
                  </TabsTrigger>
                  <TabsTrigger
                     value="explain"
                     className="flex items-center gap-2"
                  >
                     <Brain className="h-4 w-4" />
                     Explain Concept
                  </TabsTrigger>
                  <TabsTrigger
                     value="quiz"
                     className="flex items-center gap-2"
                  >
                     <FileQuestion className="h-4 w-4" />
                     Generate Quiz
                  </TabsTrigger>
                  <TabsTrigger
                     value="chat"
                     className="flex items-center gap-2"
                  >
                     <MessageSquare className="h-4 w-4" />
                     Chat
                  </TabsTrigger>
               </TabsList>

               <div className="flex-1 overflow-hidden bg-white p-2 xl:p-6 rounded-lg shadow-sm ">
                  <TabsContent
                     value="summarize"
                     className="h-full flex flex-col"
                  >
                     <div className="space-y-4 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label htmlFor="detail-level">Detail Level</Label>
                              <Select
                                 value={detailLevel}
                                 onValueChange={setDetailLevel}
                              >
                                 <SelectTrigger id="detail-level">
                                    <SelectValue placeholder="Select detail level" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="brief">Brief</SelectItem>
                                    <SelectItem value="medium">
                                       Medium
                                    </SelectItem>
                                    <SelectItem value="detailed">
                                       Detailed
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="focus-area">
                                 Focus Area (Optional)
                              </Label>
                              <Input
                                 id="focus-area"
                                 placeholder="E.g., key concepts, applications"
                                 value={focusArea}
                                 onChange={(e) => setFocusArea(e.target.value)}
                              />
                           </div>
                        </div>
                        <Button
                           onClick={handleSummarize}
                           disabled={summarizeContent.isPending}
                           className="w-full"
                        >
                           {summarizeContent.isPending ? (
                              <>
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 Summarizing...
                              </>
                           ) : (
                              <>
                                 <ListChecks className="mr-2 h-4 w-4" />
                                 Summarize Content
                              </>
                           )}
                        </Button>
                     </div>
                     <div className="text-sm text-muted-foreground">
                        <p>The AI will analyze the document and provide:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                           <li>A concise summary of the main content</li>
                           <li>Key points and important concepts</li>
                           <li>Suggested related topics to explore</li>
                        </ul>
                     </div>
                  </TabsContent>

                  <TabsContent
                     value="explain"
                     className="h-full flex flex-col"
                  >
                     <div className="space-y-4 mb-4">
                        <div className="space-y-2">
                           <Label htmlFor="concept">Concept to Explain</Label>
                           <Input
                              id="concept"
                              placeholder="Enter a concept from the material"
                              value={concept}
                              onChange={(e) => setConcept(e.target.value)}
                           />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="difficulty">Difficulty Level</Label>
                           <Select
                              value={difficultyLevel}
                              onValueChange={setDifficultyLevel}
                           >
                              <SelectTrigger id="difficulty">
                                 <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="beginner">
                                    Beginner
                                 </SelectItem>
                                 <SelectItem value="intermediate">
                                    Intermediate
                                 </SelectItem>
                                 <SelectItem value="advanced">
                                    Advanced
                                 </SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                        <Button
                           onClick={handleExplainConcept}
                           disabled={
                              explainConcept.isPending || !concept.trim()
                           }
                           className="w-full"
                        >
                           {explainConcept.isPending ? (
                              <>
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 Explaining...
                              </>
                           ) : (
                              <>
                                 <Brain className="mr-2 h-4 w-4" />
                                 Explain Concept
                              </>
                           )}
                        </Button>
                     </div>
                     <div className="text-sm text-muted-foreground">
                        <p>The AI will provide:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                           <li>A detailed explanation of the concept</li>
                           <li>Practical examples to illustrate the concept</li>
                           <li>Related concepts to explore</li>
                           <li>
                              Practice questions to test your understanding
                           </li>
                        </ul>
                     </div>
                  </TabsContent>

                  <TabsContent
                     value="quiz"
                     className="h-full flex flex-col"
                  >
                     <div className="space-y-4 mb-4">
                        <p className="text-sm">
                           Generate a quiz based on the course material to test
                           your understanding.
                        </p>
                        <Button
                           onClick={handleGenerateQuiz}
                           disabled={generateQuiz.isPending}
                           className="w-full"
                        >
                           {generateQuiz.isPending ? (
                              <>
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 Generating Quiz...
                              </>
                           ) : (
                              <>
                                 <FileQuestion className="mr-2 h-4 w-4" />
                                 Generate Quiz
                              </>
                           )}
                        </Button>
                     </div>
                     <div className="text-sm text-muted-foreground">
                        <p>The AI will create:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                           <li>
                              Multiple-choice questions based on the material
                           </li>
                           <li>Answers with explanations</li>
                           <li>
                              Questions that test different levels of
                              understanding
                           </li>
                        </ul>
                     </div>
                  </TabsContent>

                  <TabsContent
                     value="chat"
                     className="h-full flex flex-col p-4"
                  >
                     <div className="flex-1 overflow-y-auto mb-4 rounded-lg bg-gray-50 p-4">
                        {chatMessages.length === 0 ? (
                           <div className="h-full flex items-center justify-center text-center">
                              <div className="space-y-3 p-6 bg-white rounded-xl max-w-md shadow-sm">
                                 <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                                    <MessageSquare className="h-8 w-8 text-blue-600" />
                                 </div>
                                 <h3 className="text-lg font-medium text-blue-800">
                                    Start a conversation
                                 </h3>
                                 <p className="text-blue-600">
                                    Ask questions about this material or use the
                                    AI tools above to analyze the content.
                                 </p>
                              </div>
                           </div>
                        ) : (
                           <div className="space-y-4">
                              {chatMessages.map((msg, index) => (
                                 <div
                                    key={index}
                                    className={`flex ${
                                       msg.role === "user"
                                          ? "justify-end"
                                          : "justify-start"
                                    }`}
                                 >
                                    <MessageBubble message={msg} />
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                     <form
                        onSubmit={handleChatSubmit}
                        className="relative"
                     >
                        <Textarea
                           placeholder="Ask a question about this material..."
                           value={currentMessage}
                           onChange={(e) => setCurrentMessage(e.target.value)}
                           className="min-h-[60px] pr-12 rounded-xl border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100 resize-none"
                        />
                        <Button
                           type="submit"
                           disabled={
                              !currentMessage.trim() || aiLearning.isPending
                           }
                           className="absolute right-2 bottom-2 rounded-full w-10 h-10 p-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                           {aiLearning.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                           ) : (
                              <Send className="h-4 w-4" />
                           )}
                        </Button>
                     </form>
                  </TabsContent>
               </div>
            </Tabs>
         </CardContent>
      </Card>
   );
};

export default AIAnalysisPanel;
