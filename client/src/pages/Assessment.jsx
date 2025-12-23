import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const Assessment = () => {
  const { backend_url } = useContext(AppContext);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const scoringMap = { Never: 0, Sometimes: 1, Often: 2, Always: 3 };

  const isFormComplete =
    questions.length > 0 && Object.keys(answers).length === questions.length;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${backend_url}/api/quiz/questions`);
        if (res.data.success) {
          setQuestions(res.data.questions);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        toast.error("Failed to fetch questions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [backend_url]);

  const handleChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
    if (results) setResults(null);
  };

  const handleSubmit = () => {
    if (!isFormComplete) {
      toast.warn("Please answer all questions before submitting.");
      return;
    }

    const formattedAnswers = Object.keys(answers).map((index) => ({
      index: parseInt(index),
      value: answers[index],
    }));

    let categoryScores = {};
    questions.forEach((q) => (categoryScores[q.category] = 0));

    formattedAnswers.forEach((ans) => {
      const q = questions[ans.index];
      let score = scoringMap[ans.value] ?? 0;
      if (q.reverse) score = 3 - score;
      categoryScores[q.category] += score;
    });

    let categoryLevels = {};
    Object.keys(categoryScores).forEach((cat) => {
      const score = categoryScores[cat];
      if (score <= 3) categoryLevels[cat] = `Low ${cat} stress`;
      else if (score <= 6) categoryLevels[cat] = `Moderate ${cat} stress`;
      else categoryLevels[cat] = `High ${cat} stress`;
    });

    setResults(categoryLevels);
    setTimeout(() => {
      document
        .getElementById("results-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const resultItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex justify-center items-center">
        <div className="text-lime-400 text-lg sm:text-xl font-semibold">
          Loading questions...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 pt-20 px-4 sm:px-6 pb-10">
      <div className="max-w-3xl mx-auto bg-zinc-800 p-5 sm:p-8 rounded-2xl shadow-2xl border border-zinc-700">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-lime-400 mb-2 text-center sm:text-left">
          🧠 Stress Self-Assessment
        </h1>
        <p className="text-zinc-400 mb-8 text-sm sm:text-base border-b border-zinc-700 pb-3 text-center sm:text-left">
          Answer honestly to get your personalized stress analysis.
        </p>

        {/* Questions */}
        <div className="space-y-5 sm:space-y-6">
          {questions.map((q, index) => {
            const isAnswered = answers[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-zinc-800 p-4 sm:p-5 rounded-xl border-l-4 ${
                  isAnswered
                    ? "border-lime-500 shadow-lg"
                    : "border-zinc-700 shadow-sm"
                } transition-all duration-300`}
              >
                <p className="text-zinc-200 font-semibold mb-3 text-sm sm:text-base leading-snug">
                  {index + 1}. {q.text}
                </p>

                {/* Options */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {q.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`flex items-center justify-center py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer font-medium ${
                        answers[index] === opt
                          ? "bg-lime-500 text-zinc-900 font-bold shadow-md"
                          : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={opt}
                        onChange={() => handleChange(index, opt)}
                        className="hidden"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormComplete}
          className={`mt-8 w-full font-extrabold py-3 rounded-xl transition duration-200 shadow-md active:scale-95 text-sm sm:text-base ${
            isFormComplete
              ? "bg-lime-500 hover:bg-lime-600 text-zinc-900"
              : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
          }`}
        >
          {isFormComplete
            ? "Submit Assessment"
            : `Answer all ${questions.length} questions`}
        </button>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              id="results-section"
              className="mt-10 pt-5 border-t border-zinc-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 text-center sm:text-left">
                Your Stress Breakdown
              </h2>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {Object.entries(results).map(([cat, level], idx) => {
                  let colorClass = "text-green-400 border-green-500";
                  let tagClass = "bg-green-600/30 text-green-300";

                  if (level.includes("Moderate")) {
                    colorClass = "text-yellow-400 border-yellow-500";
                    tagClass = "bg-yellow-600/30 text-yellow-300";
                  } else if (level.includes("High")) {
                    colorClass = "text-red-400 border-red-500";
                    tagClass = "bg-red-600/30 text-red-300";
                  }

                  return (
                    <motion.div
                      key={idx}
                      variants={resultItemVariants}
                      className="p-4 rounded-xl bg-zinc-800 border-l-4 border-r-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <h3
                        className={`text-lg sm:text-xl font-bold ${colorClass} mb-1`}
                      >
                        {cat}
                      </h3>
                      <span
                        className={`font-semibold px-3 py-1 rounded-lg text-xs sm:text-sm ${tagClass}`}
                      >
                        {level}
                      </span>

                      {/* Progress bar */}
                      <div className="h-1.5 mt-3 rounded-full bg-zinc-700">
                        <div
                          className={`h-full rounded-full ${colorClass
                            .replace("text-", "bg-")
                            .replace("-400", "-500")}`}
                          style={{
                            width: `${(idx + 1) * 20 + 20}%`,
                          }}
                        ></div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              <p className="text-zinc-500 text-xs sm:text-sm mt-5 text-center sm:text-left">
                *Scores are relative to total points per category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Assessment;
