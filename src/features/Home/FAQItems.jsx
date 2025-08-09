import React, { useState } from 'react'

function FAQItems({question, answer}) {
  const [isOpen , SetIsOpen] = useState(false);

  return (
    <div className='mb-5 text-xl font-weight-200'>
      <div className='hover:cursor-pointer' onClick={() => SetIsOpen(!isOpen)}>{question}</div>
      <div className='mt-4 mb-4 ml-3'>
        {isOpen && 
        <div>{answer}</div>}
      </div>
      <hr />
    </div>
  )
}

export default FAQItems
