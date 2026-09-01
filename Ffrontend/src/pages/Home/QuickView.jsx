import React from 'react'

import GetTopUsers from '../../components/GetTopUsers'

import '../style/QuickView.css';

function QuickView() {
  return (
	<aside className="dashboard-right">
        <div className="card right-widget">
			<h2>Quick View</h2>
			<div className="right-tile" >
				<GetTopUsers />
			</div>
        </div>
    </aside>
  )
}

export default QuickView;