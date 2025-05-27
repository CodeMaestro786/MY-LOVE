from flask import Flask, render_template, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)

@app.route('/')
def index():
    # Calculate time together
    start_date = datetime(2023, 9, 28)  # Our relationship start date
    current_date = datetime.now()
    days_together = (current_date - start_date).days
    hours_together = days_together * 24
    minutes_together = hours_together * 60
    
    stats = {
        'days': days_together,
        'hours': hours_together,
        'minutes': minutes_together,
        'moments': 'Countless beautiful ones'
    }
    
    return jsonify(stats)

@app.route('/love-message')
def love_message():
    messages = [
        "Every moment with you is a gift",
        "You make my world complete",
        "My heart beats for you",
        "You're my favorite notification",
        "Together is my favorite place to be"
    ]
    return jsonify({'message': messages})

if __name__ == '__main__':
    app.run(debug=True)