import React, { useState } from 'react';
import './ReportModal.css';

export default function ReportModal() {
  return (
    <div className='modal-container'>
      <h1>ReportModal</h1>
      <div className='position-point'>
        <div>position</div>
        <div>champion</div>
        <div>first_important</div>
        <div>second_important</div>
        <div>third_important</div>
        <div>fourth_important</div>
        {/* <div>fifth_important</div>
        <div>sixth_important</div> */}
      </div>
      <div className='common-point'>
        <div>kda</div>
        <div>kda</div>
        <div>kda</div>
        <div>kda</div>
        <div>kda</div>
      </div>
    </div>
  );
}
