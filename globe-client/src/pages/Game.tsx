import React, { useState, useEffect } from "react";
import axios from "../utils/axios.config";
import { Check, X, Map, Trophy, Compass, MapPin, Share2, Target } from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import { useAuth } from "@/context/auth";
import { useSearchParams } from 'react-router-dom';
import { timeStamp } from "console";
import { Progress } from "@/components/ui/progress";


const Game = () => {
  const { toast } = useToast();
  const [clue, setClue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [answering, setAnswering] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const { user, setUser } = useAuth();
  const [showNextClue, setShowNextClue] = useState(false);
  const [revealedClueIndex, setRevealedClueIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft,setTimeLeft] = useState(30);
  const [attempt,setAttempt] = useState(0);
  const [searchParams] = useSearchParams();
  const friendScore = parseInt(searchParams.get("friendScore") || "0", 10);
  const [show50, setShow50] = useState([]);
  useEffect(() => {
    fetchNewClue();
    // Show toast if there's a friend score
    if (friendScore) {
      toast({
        title: "Challenge Accepted! 🌎",
        description: `Beat your friend's score of ${friendScore} points!`,
      });
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };


  useEffect(() =>{
    let timer:NodeJS.Timeout;
    if(timeLeft>0){
      timer = setTimeout(() =>{
        setTimeLeft(prev => prev -1);
      },1000);
    }
    else{
      fetchNewClue();
    }
    return () => clearTimeout(timer);
  },[timeLeft]);

  const fetchNewClue = async (forceDelete = false) => {
    setLoading(true);
    setError(null);
    setSelectedOption(null);
    setAnswerResult(null);
    setShowFeedback(false);
    setRevealedClueIndex(0);
    try {
      const response = await axios.get(
        `/game/clue${forceDelete ? "?forceDelete=true" : ""}`
      );
      if (response.data.success) {
        if (response.data.completedQuiz) {
          setClue(null);
          setError("You've completed all available clues!");
          return;
        }
        setClue(response.data.data);
        setTimeLeft(30);
        setShow50([]);
        setTimeout(() => {
          setShowNextClue(true);
        }, 5000);
      } else {
        setError("Failed to load clue");
      }
    } catch (err) {
      setError("Error connecting to the server. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  // const removeOptions = async () =>{
  //     while(show50.length < 2 && clue.options.length > 2){ 
  //     let index1= Math.floor(Math.random() * clue.options.length);
  //     let select = clue.options[index1];
  //     const [city, country] = select.split(", ");
  //     const response = await axios.post("/game/answer", {
  //       clueId: clue.clueId,
  //       city,
  //       country,
  //       score
  //     });
  //     if(!response.data.correct){
  //       show50.push(index1);
  //       clue.options.splice(index1,1);
  //     }
  //   }
  // }


  const fetchOptions = async () => {
    console.log("fetching options")
     const options =clue.options;
     const clueId = clue.clueId;
     const response = await axios.post("/game/options", {
        clueId: clue.clueId,
        options: options
      });
      clue.options = response.data.options;
      console.log("respinse",response);
  }


  const handleOptionSelect = (option) => {
    if (answerResult || answering) return; 
    setSelectedOption(option);
  };

  const submitAnswer = async () => {
    if (!clue || !selectedOption || answering) return;

    setAnswering(true);

    try {
      const [city, country] = selectedOption.split(", ");
      const response = await axios.post("/game/answer", {
        clueId: clue.clueId,
        city,
        country,
        score,
      });

      setAnswerResult(response.data);
      setAttempt(prev => prev + 1);
      if (response.data.correct) {
        // Correct answer
        setScore((prev) => prev + timeLeft);
        launchConfetti();

        // Update user stats and show toast
        saveUserProgress(true);
        toast({
          title: "Correct! 🎉",
          description: `Great job! ${response.data.infos.city.name}, ${response.data.infos.city.country.name} is the correct answer.`,
        });
        
        // Show beat friend toast if score surpasses friend's score
        if (friendScore && score + 1 > friendScore) {
          setTimeout(() => {
            toast({
              title: "New Achievement! 🏆",
              description: `You've surpassed your friend's score of ${friendScore}!`,
            });
          }, 1000);
        }
      } else {
        // Incorrect answer
        setIncorrectAnswers((prev) => prev + 1);
        showCryingEmojis();

        // Update user stats and show toast
        saveUserProgress(false);
        toast({
          title: "Not quite! 😢",
          description: `The correct answer is ${response.data.infos.city.name}, ${response.data.infos.city.country.name}.`,
          variant: "destructive",
        });
      }

      setShowFeedback(true);
    } catch (err) {
      setError("Error submitting answer. Please try again.");
      console.error(err);
    } finally {
      setAnswering(false);
    }
  };

  const saveUserProgress = (correct) => {
    if (user) {
      const updatedUser = {
        ...user,
        score: correct ? user.score + timeLeft : user.score,
      };

      setUser(updatedUser);
      localStorage.setItem("globetrotter_user", JSON.stringify(updatedUser));
    }
  };

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const showCryingEmojis = () => {
    const emojiCount = 20;
    const emojis = ["😭", "😭", "😿", "💧"];

    const existingEmojis = document.querySelectorAll(".crying-emoji");
    existingEmojis.forEach((emoji) => emoji.remove());

    for (let i = 0; i < emojiCount; i++) {
      const emoji = document.createElement("div");
      emoji.className = "crying-emoji";
      emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];

      const leftPos = Math.random() * 80 + 10;
      emoji.style.left = `${leftPos}%`;
      emoji.style.fontSize = `${Math.random() * 16 + 20}px`;
      
      document.body.appendChild(emoji);

      setTimeout(() => {
        emoji.remove();
      }, 3000);
    }
  };

  const handleNextQuestion = () => {
    fetchNewClue();
  };

  const handleNextClue = () => {
    if (!clue || revealedClueIndex >= clue.randomClue.length - 1) return;

    setRevealedClueIndex((prev) => prev + 1);
    setShowNextClue(false);

    setTimeout(() => {
      setShowNextClue(true);
    }, 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="flex w-full h-full justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-red-50 p-4 rounded-lg max-w-md mx-auto mt-4 text-center overflow-hidden">
              <h2 className="text-lg font-bold text-red-600 mb-2">Error</h2>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() =>
                  fetchNewClue(error.includes("completed all available"))
                }
                className="mt-3 px-4 py-1.5 bg-ocean text-white rounded-md hover:bg-ocean/90 transition-colors cursor-pointer"
              >
                {error.includes("completed all available")
                  ? "Restart Game"
                  : "Try Again"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center">
                <Compass className="h-7 w-7 text-ocean mr-3 animate-pulse" />
                <h1 className="text-3xl font-bold">Globetrotter Challenge</h1>
              </div>
              <p className="text-muted-foreground mt-2">
                Test your geography knowledge and explore the world!
              </p>
            </div>
           {!answerResult && ( 
            <div className="flex flex-col items-center my-2">
              <div>TimeLeft : {timeLeft}</div> 
              <Progress value={(timeLeft/30)*100} max={30} className="bg-gray-200" />
            </div>)}

            <Button className="mb-4" onClick={fetchOptions}>SHOW 50 50</Button>
            {/* Friend Challenge Banner */}
            {friendScore > 0 && (
              <Card className="mb-6 border-2 border-amber-300 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="h-6 w-6 text-amber-600 mr-3" />
                      <div>
                        <h3 className="font-bold text-amber-800">Friend's Challenge</h3>
                        <p className="text-amber-700 text-sm">Beat their score of {friendScore} points!</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-lg mr-2">
                        {score}/{friendScore}
                      </span>
                      <div className="w-32 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-amber-500 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, (score / friendScore) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="col-span-1 bg-ocean/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Correct
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-ocean flex items-center">
                    <Check className="w-5 h-5 mr-1" />
                    {score}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1 bg-coral/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    solved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-coral flex items-center">
                    <MapPin className="w-5 h-5 mr-1" />
                    {attempt}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1 bg-accent/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent flex items-center">
                    <Trophy className="w-5 h-5 mr-1" />
                    {score + incorrectAnswers > 0
                      ? `${Math.round((score / (attempt)) * 100)}%`
                      : "0%"}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1 bg-secondary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Explorer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-secondary truncate flex items-center">
                    {user ? (
                      <>
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{user.username}</span>
                      </>
                    ) : (
                      "Guest Explorer"
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {clue && (
              <Card className="mb-8 shadow-md overflow-hidden border-border">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Map className="h-5 w-5 mr-2" />
                      <span>Where in the world is this?</span>
                    </div>
                    <Badge className="bg-ocean">
                      Clue {revealedClueIndex + 1}/{clue.randomClue.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-6">
                  {!showFeedback && (
                    <div className="mb-8">
                      <div className="bg-muted/30 rounded-lg p-6 relative">
                        <div className="absolute -top-5 left-4 bg-ocean text-white text-lg font-bold w-10 h-10 flex items-center justify-center rounded-full">
                          ?
                        </div>
                        <div className="space-y-4">
                          {clue.randomClue
                            .slice(0, revealedClueIndex + 1)
                            .map((hint, index) => (
                              <p
                                key={index}
                                className={`text-lg ${index === revealedClueIndex ? 'animate-fade-in font-medium' : ''}`}
                              >
                                {index + 1}. {hint}
                              </p>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {!showFeedback ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clue.options.map((option, index) => {
                        const cityName = option.split(", ")[0];
                        const displayOption = cityName.charAt(0).toUpperCase() + cityName.slice(1);

                        return (
                          <Button
                            key={index}
                            variant="outline"
                            className={`p-4 h-auto border-2 transition-all ${selectedOption === option
                                ? "bg-ocean text-white border-ocean"
                                : "hover:bg-muted/30 hover:border-ocean"
                              }`}
                            onClick={() => handleOptionSelect(option)}
                          >
                            <div className="flex flex-col items-center w-full text-left">
                              <span className="text-xl mb-1">🌎</span>
                              <span className="font-semibold text-base">{displayOption}</span>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    answerResult && (
                      <div>
                        {answerResult.correct ? (
                          <div className="bg-green-50 p-4 rounded-lg mb-4">
                            <div className="flex justify-center mb-2">
                              <Check className="text-green-500 text-3xl" />
                            </div>
                            <h3 className="text-lg font-bold text-green-700 mb-1 text-center">
                              Correct!
                            </h3>
                            <p className="text-gray-700 text-sm text-center">
                              {answerResult.infos.city.name}, {answerResult.infos.city.country.name} is the
                              right answer.
                            </p>
                          </div>
                        ) : (
                          <div className="bg-red-50 p-4 rounded-lg mb-4">
                            <div className="flex justify-center mb-2">
                              <X className="text-red-500 text-3xl" />
                            </div>
                            <h3 className="text-lg font-bold text-red-700 mb-1 text-center">
                              Incorrect!
                            </h3>
                            <p className="text-gray-700 text-sm text-center">
                              The correct answer is {answerResult.infos.city.name},{" "}
                              {answerResult.infos.city.country.name}.
                            </p>
                          </div>
                        )}

                        {/* Fun Fact */}
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <h3 className="text-md font-bold mb-1 flex items-center justify-center">
                            <span className="text-lg mr-1.5">💡</span> Fun Fact
                          </h3>
                          <p className="text-gray-700 text-sm text-center">
                            {answerResult.infos.fun_fact && answerResult.infos.fun_fact[0]}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-4 pb-4 bg-muted/10">
                  {!showFeedback ? (
                    <div className="flex justify-between w-full">
                      {showNextClue && revealedClueIndex < clue.randomClue.length - 1 ? (
                        <Button
                          variant="outline"
                          onClick={handleNextClue}
                          className="text-ocean border-ocean hover:bg-ocean/10"
                        >
                          Reveal Next Clue
                        </Button>
                      ) : (
                        <div className="invisible">Placeholder</div>
                      )}

                      <Button
                        onClick={submitAnswer}
                        disabled={!selectedOption || answering}
                        className={`py-2 px-6 transition-colors cursor-pointer ${selectedOption && !answering
                            ? "bg-ocean text-white hover:bg-ocean/90"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                      >
                        {answering ? "Submitting..." : "Submit Answer"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between w-full">
                      <Button
                        onClick={handleNextQuestion}
                        className="bg-ocean hover:bg-ocean/90 text-white"
                      >
                        Next Destination
                      </Button>
                      <Button
                        variant="outline"
                        className="border-ocean text-ocean hover:bg-ocean/5 gap-2"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <Share2 className="h-4 w-4" />
                        Challenge a Friend
                      </Button>
                      <ShareButton isOpen={isOpen} score={score} onClose={handleClose} />
                    </div>
                  )}
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Game;