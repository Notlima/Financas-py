from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_app(app):
  print("Configurando banco de dados...")
  app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///transactions.db'
  print(f"Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
  app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
  db.init_app(app)

  with app.app_context():
    db.create_all()