//@ts-nocheck
"use client";
import { Canvas } from "@react-three/fiber";
import {
   OrbitControls,
   useGLTF,
   Text,
   Html,
   useProgress,
   PerspectiveCamera,
   Environment,
} from "@react-three/drei";
import {
   Suspense,
   useState,
   useEffect,
   useRef,
   useMemo,
   useCallback,
} from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardFooter,
} from "@/components/ui/card";
import {
   GraduationCap,
   Lightbulb,
   BookOpen,
   Award,
   RotateCcw,
   Home,
} from "lucide-react";

// Preload the model to improve loading performance
useGLTF.preload("/3d/classroom/scene.gltf");

// Quiz data by topics
const quizData = {
   geography: [
      {
         question: "What is the capital of France?",
         options: ["Paris", "London", "Berlin", "Madrid"],
         correctAnswer: "Paris",
      },
      {
         question: "Which is the largest ocean?",
         options: ["Pacific", "Atlantic", "Indian", "Arctic"],
         correctAnswer: "Pacific",
      },
      {
         question: "What is the tallest mountain in the world?",
         options: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
         correctAnswer: "Mount Everest",
      },
   ],
   math: [
      {
         question: "What is 8 × 9?",
         options: ["72", "81", "63", "54"],
         correctAnswer: "72",
      },
      {
         question: "What is the square root of 144?",
         options: ["12", "14", "10", "16"],
         correctAnswer: "12",
      },
      {
         question: "What is 45 + 67?",
         options: ["112", "102", "122", "132"],
         correctAnswer: "112",
      },
   ],
   science: [
      {
         question: "What is the chemical symbol for gold?",
         options: ["Au", "Ag", "Fe", "Cu"],
         correctAnswer: "Au",
      },
      {
         question: "What is the closest planet to the Sun?",
         options: ["Mercury", "Venus", "Earth", "Mars"],
         correctAnswer: "Mercury",
      },
      {
         question: "What gas do plants absorb from the atmosphere?",
         options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
         correctAnswer: "Carbon Dioxide",
      },
   ],
};

// Loading component to show progress
function Loader() {
   const { progress } = useProgress();
   return (
      <Html center>
         <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
               <div
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
               ></div>
            </div>
            <p className="text-gray-700">
               Loading classroom: {progress.toFixed(0)}%
            </p>
         </div>
      </Html>
   );
}

// Hook to monitor loading progress
function useLoadingProgress(callback) {
   const { progress } = useProgress();

   useEffect(() => {
      if (progress === 100) {
         setTimeout(() => {
            callback();
         }, 500); // Small delay to ensure everything is fully loaded
      }
   }, [progress, callback]);

   return progress;
}

function ClassroomModel({
   onWhiteboardPosition,
   onFloorPosition,
   onDeskPosition,
   onWallPosition,
   onWhiteboardClick,
   onFloorClick,
   onDeskClick,
   onWallClick,
}) {
   const modelRef = useRef();
   const [modelError, setModelError] = useState(null);
   const [isModelLoaded, setIsModelLoaded] = useState(false);
   const whiteboardRef = useRef(null);
   const floorRef = useRef(null);
   const deskRef = useRef(null);
   const wallRef = useRef(null);

   // Load model with error handling
   const { scene } = useGLTF("/3d/classroom/scene.gltf");

   useEffect(() => {
      if (scene) {
         scene.traverse((node) => {
            console.log("Node name:", node.name); // Keep this for debugging

            if (node.isMesh) {
               node.castShadow = true;
               node.receiveShadow = true;

               // Check node names for specific objects - using lowercase and includes for better matching
               if (
                  node.name.toLowerCase().includes("blackboard") ||
                  node.name.toLowerCase().includes("whiteboard") ||
                  node.name.toLowerCase().includes("board") ||
                  node.name.toLowerCase().includes("wall01.shape_blackboard")
               ) {
                  console.log("Found whiteboard:", node.name);
                  whiteboardRef.current = node;
                  node.userData.isWhiteboard = true;
                  const bbox = new THREE.Box3().setFromObject(node);
                  const center = new THREE.Vector3();
                  bbox.getCenter(center);
                  onWhiteboardPosition(
                     new THREE.Vector3(center.x, center.y + 0.5, center.z)
                  );
               }

               // Check for wall objects
               if (
                  node.name.toLowerCase().includes("wall") &&
                  !node.name.toLowerCase().includes("blackboard") &&
                  !node.name.toLowerCase().includes("whiteboard")
               ) {
                  console.log("Found wall:", node.name);
                  wallRef.current = node;
                  node.userData.isWall = true;
                  const bbox = new THREE.Box3().setFromObject(node);
                  const center = new THREE.Vector3();
                  bbox.getCenter(center);
                  onWallPosition(
                     new THREE.Vector3(center.x, center.y + 0.5, center.z)
                  );
               }

               if (
                  node.name.toLowerCase().includes("floor") ||
                  node.name.toLowerCase().includes("floor.shape") ||
                  node.name.toLowerCase().includes("ground")
               ) {
                  console.log("Found floor:", node.name);
                  floorRef.current = node;
                  node.userData.isFloor = true;
                  const bbox = new THREE.Box3().setFromObject(node);
                  const center = new THREE.Vector3();
                  bbox.getCenter(center);
                  onFloorPosition(
                     new THREE.Vector3(center.x, center.y + 0.05, center.z)
                  );
               }

               if (
                  node.name.toLowerCase().includes("desk") ||
                  node.name.toLowerCase().includes("table") ||
                  node.name.toLowerCase().includes("teacherdesk")
               ) {
                  console.log("Found desk:", node.name);
                  deskRef.current = node;
                  node.userData.isDesk = true;
                  const bbox = new THREE.Box3().setFromObject(node);
                  const center = new THREE.Vector3();
                  bbox.getCenter(center);
                  onDeskPosition(
                     new THREE.Vector3(center.x, center.y + 0.1, center.z)
                  );
               }

               if (node.material) {
                  if (node.material.map) {
                     node.material.map.anisotropy = 16;
                  }
                  node.material.needsUpdate = true;
               }
            }
         });
         setIsModelLoaded(true);
      }
   }, [
      scene,
      onWhiteboardPosition,
      onFloorPosition,
      onDeskPosition,
      onWallPosition,
   ]);

   // Handle click events on the classroom objects
   useEffect(() => {
      const handleClick = (event) => {
         if (!scene) return;

         event.preventDefault();

         const canvas = event.target;
         const rect = canvas.getBoundingClientRect();
         const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
         );

         const raycaster = new THREE.Raycaster();
         const camera = scene.parent?.parent?.camera;
         if (!camera) {
            console.error("Camera not found");
            return;
         }

         raycaster.setFromCamera(mouse, camera);
         const intersects = raycaster.intersectObject(scene, true);

         console.log(
            "Intersected objects:",
            intersects.map((i) => i.object.name)
         );

         if (intersects.length > 0) {
            let currentObject = intersects[0].object;
            let checkObject = (obj) => {
               console.log("Checking object:", obj.name);
               if (obj.userData?.isWhiteboard) {
                  console.log("Whiteboard clicked!");
                  onWhiteboardClick();
                  return true;
               } else if (obj.userData?.isFloor) {
                  console.log("Floor clicked!");
                  onFloorClick();
                  return true;
               } else if (obj.userData?.isDesk) {
                  console.log("Desk clicked!");
                  onDeskClick();
                  return true;
               } else if (obj.userData?.isWall) {
                  console.log("Wall clicked!");
                  onWallClick();
                  return true;
               }
               return false;
            };

            // Check the current object
            let found = checkObject(currentObject);

            // If not found, traverse up through parents
            if (!found) {
               while (currentObject.parent) {
                  currentObject = currentObject.parent;
                  if (checkObject(currentObject)) break;
               }
            }

            // Fallback for other meshes that might be part of larger objects
            if (!found) {
               // Try to find objects by name matching
               const name = intersects[0].object.name.toLowerCase();
               if (name.includes("desk") || name.includes("table")) {
                  console.log("Desk clicked by name match!");
                  onDeskClick();
               } else if (name.includes("wall") || name.includes("board")) {
                  console.log("Wall/Board clicked by name match!");
                  onWallClick();
               } else if (name.includes("floor") || name.includes("ground")) {
                  console.log("Floor clicked by name match!");
                  onFloorClick();
               }
            }
         }
      };

      const canvas = document.querySelector("canvas");
      if (canvas) {
         canvas.addEventListener("click", handleClick);
      }

      return () => {
         if (canvas) {
            canvas.removeEventListener("click", handleClick);
         }
      };
   }, [scene, onWhiteboardClick, onFloorClick, onDeskClick, onWallClick]);

   if (modelError) {
      console.error("Model loading error:", modelError);
      return (
         <Html center>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
               <p>{modelError}</p>
               <p className="mt-2">
                  Please check your model path and try refreshing the page.
               </p>
            </div>
         </Html>
      );
   }

   if (!scene || !isModelLoaded) {
      return null;
   }

   return (
      <primitive
         ref={modelRef}
         object={scene}
         scale={0.8}
         position={[0, -1.2, 0]}
         dispose={null}
      />
   );
}

function InteractiveClassroomElements() {
   // Remove all HTML elements from inside classroom
   return null;
}

function CameraControls({ isInside, setIsInside }) {
   const controlsRef = useRef();

   useEffect(() => {
      if (controlsRef.current) {
         if (isInside) {
            // Inside view limits
            controlsRef.current.minDistance = 2;
            controlsRef.current.maxDistance = 4;
            controlsRef.current.minPolarAngle = Math.PI / 3; // About 60 degrees from top
            controlsRef.current.maxPolarAngle = Math.PI / 1.8; // About 100 degrees from top
            controlsRef.current.minAzimuthAngle = -Math.PI / 4; // Limit rotation
            controlsRef.current.maxAzimuthAngle = Math.PI / 4;
         } else {
            // Outside view limits - prevent zooming too far out
            controlsRef.current.minDistance = 3;
            controlsRef.current.maxDistance = 5; // Further reduced from 6 to 5 to prevent tiny classroom
            controlsRef.current.minPolarAngle = Math.PI / 4; // Prevent viewing from directly above
            controlsRef.current.maxPolarAngle = Math.PI / 1.8;
            controlsRef.current.minAzimuthAngle = -Math.PI / 1.5; // Limit rotation range
            controlsRef.current.maxAzimuthAngle = Math.PI / 1.5;
         }

         const handleControlChange = () => {
            const distance = controlsRef.current.getDistance();
            if (distance < 3 && !isInside) {
               setIsInside(true);
            } else if (distance >= 3 && isInside) {
               setIsInside(false);
            }
         };

         controlsRef.current.addEventListener("change", handleControlChange);

         return () => {
            if (controlsRef.current) {
               controlsRef.current.removeEventListener(
                  "change",
                  handleControlChange
               );
            }
         };
      }
   }, [isInside, setIsInside]);

   return (
      <OrbitControls
         ref={controlsRef}
         enableDamping
         dampingFactor={0.05}
         rotateSpeed={0.3}
         enableZoom={true}
         zoomSpeed={0.5} // Reduced zoom speed for better control
      />
   );
}

function Scene({
   selectedTopic,
   isInside,
   setIsInside,
   userName,
   onLoadComplete,
   gameStarted,
   onNextQuestion,
   onPreviousQuestion,
   onDeskClick,
   currentQuizIndex,
}) {
   const [whiteboardPosition, setWhiteboardPosition] = useState(null);
   const [floorPosition, setFloorPosition] = useState(null);
   const [deskPosition, setDeskPosition] = useState(null);
   const [wallPosition, setWallPosition] = useState(null);
   const cameraRef = useRef();

   // Add progress tracking
   useLoadingProgress(() => {
      if (onLoadComplete) onLoadComplete();
   });

   // Camera animation effect
   useEffect(() => {
      if (cameraRef.current && isInside) {
         const startPosition = new THREE.Vector3(0, 2, 4);
         const endPosition = new THREE.Vector3(0, 1.6, 2);
         const duration = 1500;
         const startTime = Date.now();

         const animateCamera = () => {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            const easeProgress =
               progress < 0.5
                  ? 2 * progress * progress
                  : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            cameraRef.current.position.lerpVectors(
               startPosition,
               endPosition,
               easeProgress
            );

            if (progress < 1) {
               requestAnimationFrame(animateCamera);
            }
         };

         animateCamera();
      }
   }, [isInside]);

   const handleWhiteboardClick = useCallback(() => {
      if (isInside && gameStarted) {
         onNextQuestion();
      }
   }, [isInside, gameStarted, onNextQuestion]);

   const handleFloorClick = useCallback(() => {
      if (isInside && gameStarted) {
         onPreviousQuestion();
      }
   }, [isInside, gameStarted, onPreviousQuestion]);

   const handleDeskClick = useCallback(() => {
      if (isInside && gameStarted) {
         onNextQuestion();
      }
   }, [isInside, gameStarted, onNextQuestion]);

   const handleWallClick = useCallback(() => {
      if (isInside && gameStarted) {
         onPreviousQuestion();
      }
   }, [isInside, gameStarted, onPreviousQuestion]);

   return (
      <group>
         <fog
            attach="fog"
            args={["#f0f4f8", 5, 30]}
         />
         <ambientLight intensity={1.2} />
         <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            castShadow
         />
         <pointLight
            position={[-3, 4, -3]}
            intensity={1}
         />
         <pointLight
            position={[3, 4, 3]}
            intensity={1}
            color="#fff8e0"
         />

         <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={[0, 2, isInside ? 3.5 : 8]}
            fov={70}
         />

         <Suspense fallback={<Loader />}>
            <ClassroomModel
               onWhiteboardPosition={setWhiteboardPosition}
               onFloorPosition={setFloorPosition}
               onDeskPosition={setDeskPosition}
               onWallPosition={setWallPosition}
               onWhiteboardClick={handleWhiteboardClick}
               onFloorClick={handleFloorClick}
               onDeskClick={handleDeskClick}
               onWallClick={handleWallClick}
            />
            <Environment preset="city" />
         </Suspense>

         <CameraControls
            isInside={isInside}
            setIsInside={setIsInside}
         />
      </group>
   );
}

const Page = () => {
   const [selectedTopic, setSelectedTopic] = useState("geography");
   const [userName, setUserName] = useState("");
   const [isInside, setIsInside] = useState(false);
   const [isSpeaking, setIsSpeaking] = useState(false);
   const [gameStarted, setGameStarted] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [modelLoaded, setModelLoaded] = useState(false);
   const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
   const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
   const [quizAnswered, setQuizAnswered] = useState(false);
   const [selectedAnswer, setSelectedAnswer] = useState(null);
   const [score, setScore] = useState(0);
   const [showFeedback, setShowFeedback] = useState(false);
   const [feedbackMessage, setFeedbackMessage] = useState("");
   const [quizFinished, setQuizFinished] = useState(false);

   // Function to mark loading as complete
   const handleLoadComplete = useCallback(() => {
      setIsLoading(false);
      setModelLoaded(true);
   }, []);

   useEffect(() => {
      // Clean up any speech synthesis when component unmounts
      return () => {
         if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
         }
      };
   }, []);

   const handleSpeak = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
         // Cancel any ongoing speech
         window.speechSynthesis.cancel();

         setIsSpeaking(true);
         const text = quizFinished
            ? `Congratulations ${userName}! You scored ${score} out of ${quizData[selectedTopic].length} on the ${selectedTopic} quiz!`
            : isInside
            ? `Welcome to the ${selectedTopic} class! Click on the whiteboard or desk for the next question. Click on the wall or floor for the previous question.`
            : "Select a subject and enter your name to begin the interactive learning experience.";
         const utterance = new SpeechSynthesisUtterance(text);

         utterance.onend = () => setIsSpeaking(false);
         utterance.onerror = () => setIsSpeaking(false);

         window.speechSynthesis.speak(utterance);
      }
   };

   const handleStartGame = () => {
      setGameStarted(true);
      setQuizFinished(false);
      setTimeLeft(30);
      setCurrentQuizIndex(0);
      setQuizAnswered(false);
      setSelectedAnswer(null);
      setScore(0);
   };

   const handleReset = () => {
      setIsInside(false);
      setGameStarted(false);
      setQuizFinished(false);
      setSelectedTopic("geography");
      setUserName("");
      setTimeLeft(30);
      setCurrentQuizIndex(0);
      setScore(0);
   };

   const handleNextQuestion = useCallback(() => {
      if (
         currentQuizIndex < quizData[selectedTopic].length - 1 &&
         quizAnswered
      ) {
         setCurrentQuizIndex((prev) => prev + 1);
         setTimeLeft(30);
         setQuizAnswered(false);
         setSelectedAnswer(null);
         setShowFeedback(false);
      } else if (
         currentQuizIndex === quizData[selectedTopic].length - 1 &&
         quizAnswered
      ) {
         // Quiz is finished
         setQuizFinished(true);
      }
   }, [currentQuizIndex, selectedTopic, quizAnswered]);

   const handlePreviousQuestion = useCallback(() => {
      if (currentQuizIndex > 0) {
         setCurrentQuizIndex((prev) => prev - 1);
         setTimeLeft(30);
         setQuizAnswered(false);
         setSelectedAnswer(null);
         setShowFeedback(false);
      }
   }, [currentQuizIndex]);

   const handleAnswerSelection = (option) => {
      setSelectedAnswer(option);
      setQuizAnswered(true);

      const isCorrect =
         option === quizData[selectedTopic][currentQuizIndex].correctAnswer;

      if (isCorrect) {
         setScore((prevScore) => prevScore + 1);
         setFeedbackMessage("Correct!");
      } else {
         setFeedbackMessage(
            `Incorrect. The correct answer is ${quizData[selectedTopic][currentQuizIndex].correctAnswer}.`
         );
      }
      setShowFeedback(true);

      // Automatically move to next question after 2 seconds
      setTimeout(() => {
         if (currentQuizIndex < quizData[selectedTopic].length - 1) {
            setCurrentQuizIndex((prev) => prev + 1);
            setTimeLeft(30);
            setQuizAnswered(false);
            setSelectedAnswer(null);
            setShowFeedback(false);
         } else {
            // Quiz is finished
            setQuizFinished(true);
         }
      }, 2000);
   };

   const handleDeskClick = useCallback(() => {
      if (isInside && !gameStarted) {
         const confirmReset = window.confirm(
            "Are you sure you want to reset the quiz? Your progress will be lost."
         );
         if (confirmReset) {
            setCurrentQuizIndex(0);
            setScore(0);
            setTimeLeft(30);
            setQuizAnswered(false);
            setSelectedAnswer(null);
            setShowFeedback(false);
            setQuizFinished(false);
         }
      }
   }, [isInside, gameStarted]);

   // Handle timer
   useEffect(() => {
      if (!gameStarted || quizAnswered || quizFinished) return;

      const timer = setInterval(() => {
         setTimeLeft((prev) => {
            if (prev <= 1) {
             
               setQuizAnswered(true);
               setFeedbackMessage(
                  "Time's up! Click the whiteboard or desk for the next question."
               );
               setShowFeedback(true);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);

      return () => clearInterval(timer);
   }, [gameStarted, quizAnswered, quizFinished]);

   const topicIcons = {
      geography: <GraduationCap className="h-5 w-5" />,
      math: <Lightbulb className="h-5 w-5" />,
      science: <BookOpen className="h-5 w-5" />,
   };

   // Calculate star rating based on score
   const getStarRating = () => {
      const percentage = (score / quizData[selectedTopic].length) * 100;
      if (percentage >= 90) return 5;
      if (percentage >= 75) return 4;
      if (percentage >= 60) return 3;
      if (percentage >= 40) return 2;
      return 1;
   };

   return (
      <div className="h-screen w-full bg-gray-50 relative">
         {/* 3D Scene in background */}
         <div className="absolute inset-0">
            <Canvas
               shadows
               dpr={[1, 2]}
               linear={true}
            >
               <Scene
                  selectedTopic={selectedTopic}
                  isInside={isInside}
                  setIsInside={setIsInside}
                  userName={userName}
                  onLoadComplete={handleLoadComplete}
                  gameStarted={gameStarted}
                  onNextQuestion={handleNextQuestion}
                  onPreviousQuestion={handlePreviousQuestion}
                  onDeskClick={handleDeskClick}
                  currentQuizIndex={currentQuizIndex}
               />
            </Canvas>
         </div>

         {/* Congratulations Screen */}
         {quizFinished && (
            <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-md z-50 flex items-center justify-center">
               <Card className="w-[600px] max-w-[90vw] bg-white/95 backdrop-blur-md shadow-2xl border-4 border-yellow-400">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-6 pt-8">
                     <div className="relative">
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full p-4 shadow-lg">
                           <Award className="h-12 w-12 text-white" />
                        </div>
                     </div>
                     <CardTitle className="text-center text-2xl font-bold mt-6">
                        Congratulations, {userName}!
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 text-center space-y-4">
                     <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-xl font-medium text-blue-800 mb-2">
                           Quiz Results
                        </h3>
                        <p className="text-4xl font-bold text-blue-600">
                           {score} / {quizData[selectedTopic].length}
                        </p>
                        <p className="text-lg text-blue-700 mt-2">
                           {score === quizData[selectedTopic].length
                              ? "Perfect Score! 🏆"
                              : score >= quizData[selectedTopic].length * 0.7
                              ? "Great job! 🎉"
                              : "Good effort! 👍"}
                        </p>
                     </div>

                     <div className="flex justify-center mt-4 mb-2">
                        {[...Array(5)].map((_, i) => (
                           <span
                              key={i}
                              className="px-1"
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="32"
                                 height="32"
                                 fill={
                                    i < getStarRating() ? "#FFD700" : "#e2e8f0"
                                 }
                                 viewBox="0 0 16 16"
                                 className={
                                    i < getStarRating() ? "animate-pulse" : ""
                                 }
                              >
                                 <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                              </svg>
                           </span>
                        ))}
                     </div>

                     <p className="text-gray-600 mt-4">
                        You&apos;ve completed the {selectedTopic} quiz. Would you
                        like to try another topic?
                     </p>
                  </CardContent>
                  <CardFooter className="flex justify-center gap-4 p-6 bg-gray-50">
                     <Button
                        onClick={handleSpeak}
                        variant="outline"
                        disabled={isSpeaking}
                        className="flex items-center gap-2"
                     >
                        {isSpeaking ? "Speaking..." : "Read Results"}
                     </Button>
                     <Button
                        onClick={() => {
                           setQuizFinished(false);
                           setGameStarted(false);
                           setIsInside(false);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                     >
                        <Home className="h-4 w-4" />
                        Return Home
                     </Button>
                     <Button
                        onClick={() => {
                           setQuizFinished(false);
                           handleStartGame();
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                     >
                        <RotateCcw className="h-4 w-4" />
                        Try Again
                     </Button>
                  </CardFooter>
               </Card>
            </div>
         )}

         {/* Floating Quiz UI */}
         {gameStarted && !quizFinished && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto">
               <Card className="w-[500px] bg-white/90 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                     <div className="flex justify-between items-center">
                        <CardTitle>
                           {selectedTopic.charAt(0).toUpperCase() +
                              selectedTopic.slice(1)}{" "}
                           Quiz - Question {currentQuizIndex + 1} of{" "}
                           {quizData[selectedTopic].length}
                        </CardTitle>
                        <div className="flex gap-2">
                           <Badge>
                              Score: {score}/{quizData[selectedTopic].length}
                           </Badge>
                           <Badge
                              variant="secondary"
                              className={
                                 timeLeft <= 10
                                    ? "bg-red-100 text-red-800 animate-pulse"
                                    : ""
                              }
                           >
                              Time: {timeLeft}s
                           </Badge>
                        </div>
                     </div>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                           {quizData[selectedTopic][currentQuizIndex].question}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                           {quizData[selectedTopic][
                              currentQuizIndex
                           ].options.map((option, index) => (
                              <Button
                                 key={index}
                                 onClick={() => handleAnswerSelection(option)}
                                 disabled={quizAnswered}
                                 variant="outline"
                                 className={`h-20 text-lg transition-all duration-300 ${
                                    quizAnswered
                                       ? option ===
                                         quizData[selectedTopic][
                                            currentQuizIndex
                                         ].correctAnswer
                                          ? "bg-green-500 text-white border-green-700"
                                          : option === selectedAnswer
                                          ? "bg-red-500 text-white border-red-700"
                                          : "opacity-70"
                                       : "hover:bg-blue-50 hover:border-blue-500"
                                 }`}
                              >
                                 {option}
                              </Button>
                           ))}
                        </div>
                     </div>

                     {showFeedback && (
                        <div className="mt-4 p-3 rounded bg-blue-50 text-blue-800 border border-blue-100">
                           <p className="font-medium">{feedbackMessage}</p>
                           {timeLeft === 0 && (
                              <p className="text-sm mt-1">
                                 Time&apos;s up! Try to answer faster next time.
                              </p>
                           )}
                        </div>
                     )}
                  </CardContent>
               </Card>

               {isInside && (
                  <div className="text-center mt-4 bg-black/50 p-2 rounded-lg backdrop-blur-sm">
                     <p className="text-white text-sm font-medium">
                        📝 Click the whiteboard to go to the next question
                     </p>
                     <p className="text-white text-sm font-medium mt-1">
                        👇 Click the floor to go to the previous question
                     </p>
                  </div>
               )}
            </div>
         )}

         {!gameStarted && modelLoaded && (
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center">
               <Card className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                     <CardTitle className="text-xl font-bold">
                        Interactive 3D Classroom
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Your Name
                        </label>
                        <input
                           type="text"
                           placeholder="Enter your name"
                           value={userName}
                           onChange={(e) => setUserName(e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Select Topic
                        </label>
                        <Select
                           value={selectedTopic}
                           onValueChange={setSelectedTopic}
                        >
                           <SelectTrigger className="w-full border-gray-300">
                              <SelectValue placeholder="Choose a subject" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectGroup>
                                 <SelectItem value="geography">
                                    Geography
                                 </SelectItem>
                                 <SelectItem value="math">
                                    Mathematics
                                 </SelectItem>
                                 <SelectItem value="science">
                                    Science
                                 </SelectItem>
                              </SelectGroup>
                           </SelectContent>
                        </Select>
                     </div>

                     <div className="pt-2">
                        <Button
                           onClick={handleStartGame}
                           disabled={!userName.trim()}
                           className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2"
                        >
                           <div className="flex items-center justify-center">
                              {topicIcons[selectedTopic]}
                              <span className="ml-2">Enter Classroom</span>
                           </div>
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}

         {gameStarted && !isInside && modelLoaded && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
               <Card className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                     <p className="text-blue-700 font-medium mb-2">
                        Zoom in to enter the classroom!
                     </p>
                     <p className="text-gray-600 text-sm">
                        Use your scroll wheel or pinch to zoom
                     </p>
                  </CardContent>
               </Card>
            </div>
         )}

         {isLoading && (
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center">
               <Card className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden">
                  <CardContent className="p-6 text-center">
                     <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                        <div
                           className="h-full bg-blue-500 transition-all duration-300 ease-out animate-pulse"
                           style={{ width: "100%" }}
                        ></div>
                     </div>
                     <p className="text-gray-700">
                        Preparing your classroom experience...
                     </p>
                  </CardContent>
               </Card>
            </div>
         )}

         <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
               onClick={handleSpeak}
               disabled={isSpeaking}
               variant="outline"
               className="bg-white hover:bg-gray-50 text-blue-700 border border-blue-200 px-4 py-2 rounded shadow transition-colors"
            >
               {isSpeaking ? "Speaking..." : "Read Aloud"}
            </Button>

            {isInside && (
               <Button
                  onClick={() => setIsInside(false)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200 px-4 py-2 rounded shadow transition-colors"
               >
                  Exit Classroom
               </Button>
            )}

            <Button
               onClick={handleReset}
               className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 px-4 py-2 rounded shadow transition-colors"
            >
               Reset
            </Button>
         </div>
      </div>
   );
};

export default Page;
