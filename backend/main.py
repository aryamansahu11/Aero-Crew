from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models # <-- YEH NAYI LINE ADD KARNI HAI

# Tables create karne ka magic command
models.Base.metadata.create_all(bind=engine)

# ... baaki ka poora code waisa hi rahega ...
app = FastAPI(title="National Airfare Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Abhi sab allow kar diya testing ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "success", 
        "message": "AeroCrew CPI Engine is Live!",
        "version": "1.0"
    }

@app.get("/api/airfare-trend")
def get_airfare_trend(db: Session = Depends(get_db)):
    records = db.query(models.AirfareIndex).order_by(models.AirfareIndex.record_date).all()
    
    trend_data = []
    for record in records:
        trend_data.append({
            "date": record.record_date.strftime("%d %b"),
            "national": record.national_index,
            "t1": record.t1_index,
            "t7": record.t7_index,
            "t15": record.t15_index,
            "t30": record.t30_index,
            "t45": record.t45_index
        })
    return {"trend_data": trend_data}