from flask import Flask, request, jsonify, render_template, send_from_directory
from database import db, init_app
from models import Transaction
from datetime import datetime
from sqlalchemy import func

app = Flask(__name__)
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST')
    return response

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///transactions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

init_app(app)

@app.route('/static/<path:filename>')
def static_files(filename):
  return send_from_directory('static', filename)

@app.route("/")
def index():
  return render_template("index.html")

@app.route("/transactions", methods=["POST"])
def add_transaction():
  data = request.json
  valor = float(data["valor"])
  categoria = data["categoria"]
  
  data_transacao = datetime.fromisoformat(data.get("data", datetime.now().isoformat()))
  #Saláro é possitivo, despesas negativas
  valor_final = valor if categoria == "salario" else -valor

  nova_transacao = Transaction(
    valor=valor_final, 
    categoria=categoria,
    data=data_transacao)
  db.session.add(nova_transacao)
  db.session.commit()

  return jsonify({
    "status": "success", 
    "transacao": nova_transacao.to_dict()
    })

@app.route("/transactions", methods=["GET"])
def get_transaction():
  transacoes = Transaction.query.all()
  return jsonify([t.to_dict() for t in transacoes])

@app.route("/transactions/summary", methods=["GET"])
def get_summary():
    today = datetime.now()
    current_mont = today.month
    current_year = today.year
    
    transactions = Transaction.query.filter(
        func.extract('month', Transaction.data) == current_mont,
        func.extract('year', Transaction.data) == current_year
    ).all()
    
    income = sum(t.valor for t in transactions if t.valor > 0)
    outcome = abs(sum(t.valor for t in transactions if t.valor < 0))
    balance = income - outcome
    
    return jsonify({
        "entradas": income,
        "saidas": outcome,
        "saldo": balance
    })

if __name__ == "__main__":
  app.run(debug=True)