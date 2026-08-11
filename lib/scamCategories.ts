import { ScamCategory } from './types'

export const scamCategories: ScamCategory[] = [
  {
    id: 'agyapade',
    name: 'Agyapade / Fake Lottery',
    tagline: '"Congratulations, you won GHS 50,000!"',
    description:
      'The most common Ghanaian scam SMS. You are told you won a big cash prize in a lottery or promo you never entered. To claim it, you must first pay an "activation fee" or "processing fee" via MoMo — after which the money never comes.',
    redFlags: [
      'You "won" a prize in a draw you never entered',
      'You must pay a fee before receiving winnings',
      'A random phone number instead of an official line',
      'Urgent tone: "claim before midnight!"',
    ],
    howToReport: 'Forward the SMS to the National Communications Authority at 500 (short code) or report to your network\'s fraud line.',
    accent: '#CE1126',
  },
  {
    id: 'momopin',
    name: 'MoMo PIN Phishing',
    tagline: '"Your MoMo account will be blocked, verify your PIN"',
    description:
      'Fraudsters impersonate MTN MoMo, Telecel Cash, or AT Money support. The message claims your account is suspended or blocked and asks you to "verify" by entering your PIN, OTP, or linking your card. Your real PIN gives them total control of your wallet.',
    redFlags: [
      'Claims your account is blocked or suspended',
      'Asks for your PIN, OTP, or full card details',
      'Threats or deadline pressure to act fast',
      'Sender is a random number, not the official MoMo shortcode (e.g. MTN uses 1837)',
    ],
    howToReport: 'Never share your PIN. Report to your network: MTN 100, Telecel 100, AT 100. You can also report on the Vodafone Cash / MTN MoMo app.',
    accent: '#FCD116',
  },
  {
    id: 'simswap',
    name: 'SIM Swap Scam',
    tagline: '"Your SIM will be deactivated today. Confirm your details"',
    description:
      'The fraudster asks for your date of birth, ID details, or phone number to "confirm your SIM". With these, they can request a SIM swap at a network outlet, take over your number, and drain your MoMo wallet when OTPs arrive.',
    redFlags: [
      'Asks for your date of birth or Ghana Card details',
      'Mentions SIM deactivation or reactivation',
      'Asks you to "confirm" details you never shared',
      'Unusual calls claiming to be network engineers',
    ],
    howToReport: 'Call your network immediately (MTN 100, Telecel 100, AT 100). If your line stops working unexpectedly, visit an official outlet to check for SIM swaps.',
    accent: '#006B3F',
  },
  {
    id: 'fakedeposit',
    name: 'Fake Deposit Scam',
    tagline: '"GHS 2,000 deposited to your MoMo. Send back the overpayment"',
    description:
      'You receive an SMS claiming money was deposited to your wallet. A "customer" then calls saying they sent too much and asks you to send the difference back. The original deposit never happened — you send real money to a thief.',
    redFlags: [
      'Deposit SMS without a matching notification in your wallet app',
      'Someone asks you to "send back" an overpayment',
      'Pressure to act before you can check your balance',
      'The deposit message references a transaction you did not make',
    ],
    howToReport: 'Always check your real wallet balance before sending anything. Report the number to your network fraud line and the police cybercrime unit (e.g. CID Cyber Crime Unit).',
    accent: '#CE1126',
  },
  {
    id: 'fakepromo',
    name: 'Fake Network Promo',
    tagline: '"MTN data double-up! Click this link to activate"',
    description:
      'Links to fake promo pages mimicking MTN, Telecel, or AT. They steal your number and OTPs, or push fake "winning" pages. Official promos never come from random numbers with clickable links asking for your PIN.',
    redFlags: [
      'Shortened links (bit.ly, tinyurl) to "official" promos',
      'Asks for your phone number, PIN, or OTP',
      'Grammar errors and odd phrasing',
      'Says "click now" with expiry pressure',
    ],
    howToReport: 'Check promos on the network\'s official app or website first. Forward suspicious promo SMS to 500 (NCA shortcode).',
    accent: '#FCD116',
  },
  {
    id: 'romance',
    name: 'Romance Scam',
    tagline: '"I love you, but I\'m stuck in Accra — send me GHS 800"',
    description:
      'A new "partner" online quickly falls in love, then needs money urgently — for travel, a sick relative, customs, or a lost wallet. The persona is fake; your money is the goal.',
    redFlags: [
      'Declares love within days of first contact',
      'Never meets on video or in person',
      'Always has an emergency that needs MoMo',
      'Avoids questions and changes details constantly',
    ],
    howToReport: 'Stop sending money and cut contact. Save evidence (chats, numbers) and report to the CID Cyber Crime Unit or via the NCA.',
    accent: '#006B3F',
  },
  {
    id: 'employment',
    name: 'Employment Scam',
    tagline: '"Congratulations, you\'re hired! Pay GHS 150 for processing"',
    description:
      'Fake job offers — often targeting fresh graduates — demand "registration fees", "work permit costs", or "training fees" before you can start. Real employers never charge you to hire you.',
    redFlags: [
      'Job offer without any interview',
      'Salary too good for the work described',
      'Fee demanded before you start',
      'Contact only via WhatsApp or random numbers',
    ],
    howToReport: 'Verify the company directly on its official site. Report the number to your network and the Labour Commission.',
    accent: '#CE1126',
  },
  {
    id: 'ghostsalary',
    name: 'Ghost Salary / Gov Scam',
    tagline: '"Your salary has been blocked. Confirm your E-zwich PIN"',
    description:
      'Messages impersonating government institutions, GRA, or employers. They ask you to "confirm" payment details, E-zwich or salary codes, or pay a "processing fee" to unblock payments that were never frozen.',
    redFlags: [
      'Government agencies never ask for your PIN by SMS',
      'Requests for card numbers, E-zwich PINs, or OTPs',
      'Threats about blocked salaries or taxes',
      'Links to sites that look slightly wrong',
    ],
    howToReport: 'Contact your employer or the institution directly using official channels. Report to the NCA and CID Cyber Crime Unit.',
    accent: '#FCD116',
  },
]
