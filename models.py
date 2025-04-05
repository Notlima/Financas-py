from database import db

class Transaction(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  valor = db.Column(db.Float, nullable=False)
  categoria = db.Column(db.String(50), nullable=False)
  data = db.Column(db.DateTime, default=db.func.now())

  def to_dict(self):
    return {
    "id": self.id,
    "valor": float(self.valor),
    "categoria": self.categoria,
    "data": self.data.isoformat()
    }
