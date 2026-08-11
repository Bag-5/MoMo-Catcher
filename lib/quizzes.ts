import { QuizQuestion } from './types'

export const quizQuestions: QuizQuestion[] = [
  {
    question: 'You get an SMS: "Congratulations! You won GHS 50,000 in the MTN Agyapade promo. Call 0247000000 to claim." You never entered any promo. What do you do?',
    options: [
      'Call the number immediately to claim your prize',
      'Ignore and delete it — and never pay any "fee" to claim',
      'Send them your MoMo number so they can deposit',
      'Share it with friends so they can win too',
    ],
    answerIndex: 1,
    explanation: 'This is a classic Agyapade/fake lottery scam. If you won a real prize, it would never require calling a random number — and real prizes never ask you to pay a fee first.',
  },
  {
    question: 'A message says your MoMo account will be blocked unless you "verify your PIN" by replying. What should you do?',
    options: [
      'Reply with your PIN quickly before it\'s blocked',
      'Call the number to verify',
      'Never share your PIN — networks never ask for it by SMS',
      'Send your mother\'s name as extra security',
    ],
    answerIndex: 2,
    explanation: 'No network or bank ever asks for your MoMo PIN or OTP by SMS, call, or link. Anyone who asks is a fraudster.',
  },
  {
    question: 'Which of these Ghanaian phone number prefixes is for MTN?',
    options: ['024 / 055', '020 / 050', '027 / 057', '026 / 056'],
    answerIndex: 0,
    explanation: 'MTN uses 024/025/054/055/059/053, Telecel (Vodafone) uses 020/050, and AT (AirtelTigo) uses 027/057/026/056.',
  },
  {
    question: 'Someone deposits money "by mistake" and asks you to send it back. What\'s the safest move?',
    options: [
      'Send it back immediately — it\'s only fair',
      'Send it back plus a little extra for their trouble',
      'Check your real wallet balance first; if nothing arrived, it\'s a scam',
      'Send the difference only',
    ],
    answerIndex: 2,
    explanation: 'In the fake deposit scam, no money ever arrives. Always check your actual balance before sending anything back.',
  },
  {
    question: 'A "promo link" is shortened with bit.ly. Why should you be careful?',
    options: [
      'Short links are always scams',
      'You can\'t see where the link really leads',
      'Short links load too slowly',
      'They only work at night',
    ],
    answerIndex: 1,
    explanation: 'Shortened links hide the real destination. A legit Ghanaian network promo will be on the official site or app, not a random shortened link.',
  },
  {
    question: 'What is a SIM swap scam?',
    options: [
      'Swapping SIM cards with a friend',
      'Fraudsters using your details to take over your phone number and drain your MoMo',
      'A free upgrade from the network',
      'Moving your SIM to a new phone',
    ],
    answerIndex: 1,
    explanation: 'If a fraudster gets your details (DOB, Ghana Card, etc.), they can activate your number on a new SIM, receive your OTPs, and empty your wallet.',
  },
  {
    question: 'Which of these should you NEVER send to anyone?',
    options: [
      'Your favourite food',
      'Your MoMo PIN and OTP',
      'Your favourite football team',
      'Your network (MTN, Telecel, AT)',
    ],
    answerIndex: 1,
    explanation: 'Your MoMo PIN and OTP are the keys to your money. Nobody legitimate — not even the network — ever needs them from you.',
  },
  {
    question: 'A "recruiter" offers you a job with no interview and asks for GHS 150 "processing fee". What is this?',
    options: [
      'A standard hiring practice',
      'A lucky opportunity — pay fast',
      'An employment scam — real employers don\'t charge you to hire you',
      'A government fee',
    ],
    answerIndex: 2,
    explanation: 'Legitimate employers pay you; they never charge you. Job scams target fresh graduates with too-good-to-be-true offers and "fees".',
  },
  {
    question: 'What should you check before trusting a deposit SMS?',
    options: [
      'The colour of the message icon',
      'Your actual wallet balance in the app',
      'How many times the SMS repeats',
      'The phone\'s battery level',
    ],
    answerIndex: 1,
    explanation: 'The real test of any deposit is your actual balance in the official wallet app. SMS alone proves nothing.',
  },
  {
    question: 'Someone online declares love in two days and needs GHS 800 for "travel". What\'s happening?',
    options: [
      'True love — send it',
      'A romance scam; the persona is fake, the money is the goal',
      'A test of your loyalty',
      'A lucky connection',
    ],
    answerIndex: 1,
    explanation: 'Romance scams rush to affection, then invent emergencies. Real relationships don\'t start with money requests from strangers.',
  },
  {
    question: 'Where can you report scam SMS in Ghana?',
    options: [
      'Only by deleting the message',
      'The NCA shortcode 500 and your network\'s fraud line',
      'By replying to the scammer',
      'The weather report',
    ],
    answerIndex: 1,
    explanation: 'The National Communications Authority (NCA) accepts scam reports via 500, and each network has its own fraud hotline (e.g. MTN 100).',
  },
  {
    question: 'What does "https://" on a website mean?',
    options: [
      'The site is definitely a scam',
      'The connection is encrypted — a good sign, but not a guarantee of safety',
      'The site is Ghanaian',
      'The site is free',
    ],
    answerIndex: 1,
    explanation: 'HTTPS means data is encrypted, which is good. But scammers use HTTPS too — it\'s just one check among many.',
  },
]
