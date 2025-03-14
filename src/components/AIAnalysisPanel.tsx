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
} from "lucide-react";
import {
   useAILearning,
   useSummarizeContent,
   useExplainConcept,
   useGenerateQuiz,
} from "@/hooks/useAI";

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

   // Handle chat submission
   const handleChatSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentMessage.trim()) return;

      const newMessage = { role: "user", content: currentMessage };
      const updatedMessages = [...chatMessages, newMessage];
      setChatMessages(updatedMessages);
      setCurrentMessage("");

      try {
         const response = await aiLearning.mutateAsync({
            messages: updatedMessages,
            course_id: courseId,
         });

         setChatMessages([
            ...updatedMessages,
            { role: "assistant", content: response.response },
         ]);
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
            content,
            detail_level: detailLevel,
            focus_areas: focusArea ? [focusArea] : undefined,
         });

         setChatMessages([
            {
               role: "user",
               content: `Please summarize this material: ${materialTitle}`,
            },
            {
               role: "assistant",
               content: `
# Summary of ${materialTitle}

${response.summary}

## Key Points
${response.key_points.map((point) => `- ${point}`).join("\n")}

## Suggested Topics to Explore
${response.suggested_topics.map((topic) => `- ${topic}`).join("\n")}
            `,
            },
         ]);
         setActiveTab("chat");
      } catch (error) {
         console.error("Error summarizing content:", error);
      }
   };

   // Handle explain concept
   const handleExplainConcept = async () => {
      if (!concept.trim()) return;

      try {
         const response = await explainConcept.mutateAsync({
            concept,
            context: materialTitle,
            difficulty_level: difficultyLevel,
         });

         setChatMessages([
            { role: "user", content: `Please explain the concept: ${concept}` },
            {
               role: "assistant",
               content: `
# ${concept}

${response.explanation}

## Examples
${response.examples.map((example) => `- ${example}`).join("\n")}

## Related Concepts
${response.related_concepts.map((rc) => `- ${rc}`).join("\n")}

${
   response.practice_questions && response.practice_questions.length > 0
      ? `
## Practice Questions
${response.practice_questions
   .map(
      (q, i) => `
${i + 1}. ${q.question}
${q.options ? q.options.map((opt) => `   - ${opt}`).join("\n") : ""}
`
   )
   .join("\n")}
`
      : ""
}
            `,
            },
         ]);
         setActiveTab("chat");
         setConcept("");
      } catch (error) {
         console.error("Error explaining concept:", error);
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
      <Card className="w-full h-full flex flex-col">
         <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
               <CardTitle className="text-xl">AI Learning Assistant</CardTitle>
               <Button
                  variant="outline"
                  onClick={onClose}
               >
                  Close
               </Button>
            </div>
            <p className="text-sm text-muted-foreground">
               Analyzing: {materialTitle}
            </p>
         </CardHeader>
         <CardContent className="flex-1 overflow-hidden flex flex-col">
            <Tabs
               value={activeTab}
               onValueChange={setActiveTab}
               className="flex-1 flex flex-col"
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

               <div className="flex-1 overflow-hidden">
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
                     className="h-full flex flex-col"
                  >
                     <div className="flex-1 overflow-y-auto mb-4 border rounded-md p-4">
                        {chatMessages.length === 0 ? (
                           <div className="h-full flex items-center justify-center text-center p-4">
                              <div className="space-y-2">
                                 <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground" />
                                 <p className="text-sm text-muted-foreground">
                                    No messages yet. Start a conversation or use
                                    one of the AI tools.
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
                                    <div
                                       className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                          msg.role === "user"
                                             ? "bg-primary text-primary-foreground"
                                             : "bg-muted"
                                       }`}
                                    >
                                       <div className="whitespace-pre-line">
                                          {msg.content}
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                     <form
                        onSubmit={handleChatSubmit}
                        className="flex gap-2"
                     >
                        <Textarea
                           placeholder="Ask a question about this material..."
                           value={currentMessage}
                           onChange={(e) => setCurrentMessage(e.target.value)}
                           className="min-h-[60px] flex-1"
                        />
                        <Button
                           type="submit"
                           disabled={
                              !currentMessage.trim() || aiLearning.isPending
                           }
                        >
                           {aiLearning.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                           ) : (
                              "Send"
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
