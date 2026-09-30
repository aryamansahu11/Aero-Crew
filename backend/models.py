from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# 1. Routes and Weights Table (Static Data / Master Table)
class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    route_code = Column(String(10), unique=True, index=True)  # e.g., "DEL-BOM"
    origin = Column(String(5))        # "DEL"
    destination = Column(String(5))   # "BOM"
    category = Column(String(50))     # e.g., "Metro-to-Metro", "UDAN"
    
    # CPI Formula Variables
    base_price = Column(Float)        # P0i: Base year (2024) reference price
    weight = Column(Float)            # Wi: HCES Expenditure Weight (e.g., 0.1180)

    # Relationship
    fare_records = relationship("FareRecord", back_populates="route")

# 2. Daily Scraped Fares Table (Dynamic / Time-Series Data)
class FareRecord(Base):
    __tablename__ = "fare_records"

    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"))
    
    scrape_date = Column(Date, index=True)     # Jis din data fetch kiya (Today)
    flight_date = Column(Date)                 # Flight kab ki hai
    advance_horizon = Column(String(10))       # e.g., "T+1", "T+15"
    carrier = Column(String(10))               # e.g., "6E" (IndiGo), "AI"
    
    # CPI Formula Variable
    current_price = Column(Float)              # P1i: Current period price
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    route = relationship("Route", back_populates="fare_records")

# 3. Calculated Final CPI Index Table (For Recharts API)
class AirfareIndex(Base):
    __tablename__ = "airfare_index"

    id = Column(Integer, primary_key=True, index=True)
    record_date = Column(Date, unique=True, index=True)
    
    national_index = Column(Float)
    
    # Nayi Columns: Advance Booking Horizons ke liye
    t1_index = Column(Float)   # T+1 (Spot/Emergency - Highest Price)
    t7_index = Column(Float)   # T+7
    t15_index = Column(Float)  # T+15 (Standard)
    t30_index = Column(Float)  # T+30
    t45_index = Column(Float)  # T+45 (Early Bird - Lowest Price)
    
    created_at = Column(DateTime, default=datetime.utcnow)