import React from 'react'
import FAQItems from './FAQItems'

function FAQList() {
  const faqData = [
    {
      question: "Is it legal to sell or buy notes?",
      answer: "Yes. Sharing and selling original notes you’ve created is completely legal. Just make sure your notes don’t include copyrighted textbooks or institutional material word-for-word."
    },
    {
      question: "How do I get paid as a senior?",
      answer: "Once your notes are approved and purchased, earnings will be credited to your wallet. You can withdraw anytime via UPI, Paytm, or bank transfer."
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely. We use trusted payment gateways to ensure your transactions are encrypted and safe."
    },
    {
      question: "Can I preview notes before buying?",
      answer: "Yes! We offer previews of all notes — see sample pages, table of contents, and more before making a purchase."
    },
    {
      question: "How long does it take to get access after purchase?",
      answer: "Instantly. As soon as your payment is successful, the download link is unlocked and also sent to your email."
    },
    {
      question: "Can I request a refund if the notes aren’t helpful?",
      answer: "Refunds are available if the content is significantly different from its preview or description. Just raise a ticket within 48 hours of purchase."
    },
  ]
  return (
    <div className="p-10">
      <h2 className="text-4xl text-center font-bold mb-10">
        Frequently Asked Questions
      </h2>
      {faqData.map((faq, index) => (
        <FAQItems key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
}

export default FAQList
