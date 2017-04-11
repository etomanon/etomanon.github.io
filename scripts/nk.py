
import time
import bs4 as bs
import urllib.request
import psycopg2
import sys
import re
import datetime

try:
	conn = psycopg2.connect("dbname=spatial user=postgres password=postgres")
	cur = conn.cursor()
	print ('Připojen k databázi')
except:
	sys.exit("Připojení k databázi selhalo")

bbox = [16.58, 48.63, 17.02, 49.20]
while True:
	source = urllib.request.urlopen('http://aplikace.policie.cz/dopravni-informace/GetFile.aspx').read()
	soup = bs.BeautifulSoup(source,'xml')
	
	cur.execute("TRUNCATE TABLE udalosti;")
	conn.commit()
	for i in soup.find_all('MSG'):
		if (float(i.find('SBEG')['x']) >= bbox[0] and float(i.find('SBEG')['x']) <= bbox[2] and float(i.find('SBEG')['y']) >= bbox[1] and float(i.find('SBEG')['y']) <= bbox[3]):
			if re.search(".*nehoda.*", str((i.find('OTXT').text))) is not None:
				druh = "nehoda"
			elif (re.search(".*práce.*", str((i.find('OTXT').text)))) is not None:
				druh = "práce"
			else:
				druh = "jiné"

			print(i.find('OTXT').text)
			cur.execute("INSERT INTO udalosti (udalost, geom, od, az_do, typ, kde) VALUES ('" + str(i.find('OTXT').text) + "', ST_GeomFromText('POINT(" + str(i.find('SBEG')['x']) + " " + str(i.find('SBEG')['y']) + ")', 4326),'" + str(i.find('TSTA')['time']) + " " + str(i.find('TSTA')['date']) + "','" + str(i.find('TSTO')['time']) + " " + str(i.find('TSTO')['date']) + "','" + druh + "','" + str(i.find('TXPL').text) + "');")
			conn.commit()

	print("-------------------------")
	time.sleep(30)