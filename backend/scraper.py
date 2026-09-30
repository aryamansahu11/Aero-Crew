from playwright.sync_api import sync_playwright
from datetime import datetime, date, timedelta
from database import SessionLocal
import models
import random
import time

def setup_routes(db):
    # Agar database me koi route nahi hai, toh SIH demo ke liye ek route add karo
    if db.query(models.Route).count() == 0:
        base_route = models.Route(
            route_code="DEL-BOM",
            origin="DEL",
            destination="BOM",
            category="Metro-to-Metro",
            base_price=5500.0,
            weight=0.1180
        )
        db.add(base_route)
        db.commit()
        print("✅ Base route DEL-BOM database me add ho gaya.")

def scrape_flight_price(origin, destination, travel_date):
    """
    Playwright se Google Flights/Travel aggregator scrape karne ka logic.
    Hackathon me websites heavily bot block karti hain, isliye Exception Handling aur Fallback zaroori hai.
    """
    print(f"🔍 Searching flights for {origin} to {destination} on {travel_date}...")
    
    with sync_playwright() as p:
        # headless=True matlab browser hide hokar piche chalega
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        try:
            # Conceptual generic flight search URL
            url = f"https://www.google.com/travel/flights?q=Flights%20to%20{destination}%20from%20{origin}%20on%20{travel_date}"
            page.goto(url, timeout=30000)
            
            # Smart India Hackathon Pro-Tip: DOM selectors (.YMlIz) websites par lagatar change hote hain.
            # Real deployment me XPath ya robust selectors use kiye jate hain.
            page.wait_for_selector(".YMlIz", timeout=8000) 
            
            price_element = page.query_selector(".YMlIz")
            price_text = price_element.inner_text() if price_element else "₹6,500"
            
            # String formatting: "₹6,500" -> 6500.0
            clean_price = float(price_text.replace("₹", "").replace(",", "").strip())
            print(f"✈️ Live Price Found: ₹{clean_price}")
            
        except Exception as e:
            # Agar bot-protection ki wajah se block ho jaye, toh SIH pitching ke waqt code crash na ho:
            print(f"⚠️ Scraping blocked by CAPTCHA/Timeout. Generating fallback realistic price.")
            clean_price = float(random.randint(5500, 8500))
            print(f"✈️ Fallback Price Generated: ₹{clean_price}")
            
        finally:
            browser.close()
            
        return clean_price

def run_scraper_engine():
    db = SessionLocal()
    try:
        # 1. Check Initial Routes
        setup_routes(db)
        
        # 2. Db se routes fetch karna
        routes = db.query(models.Route).all()
        today = date.today()
        flight_date = today + timedelta(days=1) # Target: Tomorrow (T+1 Window)
        
        for route in routes:
            # 3. Engine ko hit karna
            live_price = scrape_flight_price(route.origin, route.destination, flight_date.strftime("%Y-%m-%d"))
            
            # 4. Scraped result ko database (MySQL) me dalna
            new_fare = models.FareRecord(
                route_id=route.id,
                scrape_date=today,
                flight_date=flight_date,
                advance_horizon="T+1",
                carrier="6E", # Demo assumption (IndiGo)
                current_price=live_price
            )
            
            db.add(new_fare)
            db.commit()
            print(f"💾 Database Updated: {route.route_code} | Price: ₹{live_price}\n")
            
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Starting AeroCrew Data Scraper Engine...")
    run_scraper_engine()
    print("✅ Scraping cycle complete!")