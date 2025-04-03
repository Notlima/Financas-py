from flask import Flask, request, jsonify, render_template, send_from_directory
from database import db, init_app
from models import Transaction
from datetime import datetime

app = Flask(__name__)

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

  #Saláro é possitivo, despesas negativas
  valor_final = valor if categoria == "salario" else -valor

  nova_transacao = Transaction(valor=valor_final, categoria=categoria)
  db.session.add(nova_transacao)
  db.session.commit()

  return jsonify({"status": "success", "transacao": nova_transacao.to_dict()})

@app.route("/transactions", methods=["GET"])
def get_transaction():
  transacoes = Transaction.query.all()
  return jsonify([t.to_dict() for t in transacoes])

if __name__ == "__main__":
  app.run(debug=True)