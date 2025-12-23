export const getQuestions = async (req, res) => {
  try {
    const questions = [
      { text: "I feel stressed due to lack of sleep.", options: ["Never","Sometimes","Often","Always"], category: "Sleep", reverse: false },
      { text: "I have trouble finishing my workload.", options: ["Never","Sometimes","Often","Always"], category: "Workload", reverse: false },
      { text: "I feel anxious in social situations.", options: ["Never","Sometimes","Often","Always"], category: "Social", reverse: false },
      { text: "I feel tired or fatigued without reason.", options: ["Never","Sometimes","Often","Always"], category: "Emotional", reverse: false },
      { text: "I find it hard to relax.", options: ["Never","Sometimes","Often","Always"], category: "Emotional", reverse: false },
      { text: "I avoid social interactions due to stress.", options: ["Never","Sometimes","Often","Always"], category: "Social", reverse: false },
      { text: "I feel tense or irritable frequently.", options: ["Never","Sometimes","Often","Always"], category: "Workload", reverse: false },
      { text: "I feel overwhelmed by responsibilities.", options: ["Never","Sometimes","Often","Always"], category: "Workload", reverse: false },
      { text: "I have mood swings frequently.", options: ["Never","Sometimes","Often","Always"], category: "Emotional", reverse: false },
      { text: "I feel anxious before exams or deadlines.", options: ["Never","Sometimes","Often","Always"], category: "Workload", reverse: false },
    ];

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const calculateScore = async (req, res)=>{
  try {
    const { answers } = req.body

    const scoringMap = { "Never": 0, "Sometimes": 1, "Often": 2, "Always": 3 }

    const questions = [
      { text: "I feel stressed often.", reverse: false },
      { text: "I have trouble concentrating.", reverse: false },
      { text: "I feel anxious in social situations.", reverse: false },
      { text: "I have trouble sleeping due to stress.", reverse: false },
      { text: "I feel overwhelmed by my responsibilities.", reverse: false },
      { text: "I am able to stay calm under pressure.", reverse: true },
      { text: "I can easily relax after a stressful day.", reverse: true },
      { text: "I handle unexpected problems well.", reverse: true },
      { text: "I feel confident in managing daily challenges.", reverse: true },
      { text: "I recover quickly after stressful events.", reverse: true },
    ];

    let  total = 0

    answers.forEach( ans =>{
      const q = questions[ans.index]
      let score = scoringMap[ans.value] ?? 0

      if(q.reverse){
        score = 3 - score
      }

      total += score 

    })

    let level = "Low Stress"
    if (total >= 15 && total <= 20) level = "Moderate Stress"
    if (total > 20) level = "High Stress"

    res.json({ success: true, score: total, level });

  } catch (error) {
     res.status(500).json({ success: false, message: error.message })
  }
}