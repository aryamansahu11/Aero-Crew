from database import SessionLocal
import models
from datetime import date, timedelta
import random

def seed_historical_data():
    db = SessionLocal()
    try:
        today = date.today()
        
        # Base values for realistic yield curve
        base_t1 = 135.0  # Last minute (Sabse mehnga)
        base_t7 = 118.0
        base_t15 = 102.0
        base_t30 = 94.0
        base_t45 = 88.0  # Early bird (Sabse sasta)

        print("⏳ Generating 30 days of Multi-Horizon Data...")
        db.query(models.AirfareIndex).delete()

        for i in range(30, -1, -1):
            record_date = today - timedelta(days=i)
            
            # Volatility (T+1 me sabse zyada fluctuation hota hai)
            new_index = models.AirfareIndex(
                record_date=record_date,
                national_index=round(base_t15 + random.uniform(-1, 1.5), 2),
                t1_index=round(base_t1 + random.uniform(-3.5, 4.0), 2),
                t7_index=round(base_t7 + random.uniform(-2.0, 2.5), 2),
                t15_index=round(base_t15 + random.uniform(-1.0, 1.5), 2),
                t30_index=round(base_t30 + random.uniform(-0.5, 1.0), 2),
                t45_index=round(base_t45 + random.uniform(-0.2, 0.5), 2)
            )
            db.add(new_index)

        db.commit()
        print("✅ Multi-Horizon Data Seeded Successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_historical_data()