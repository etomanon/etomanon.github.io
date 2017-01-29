from selenium import webdriver
import time
from bs4 import BeautifulSoup
import lxml
import re
import psycopg2
import sys


try:
	conn = psycopg2.connect("dbname=spatial user=postgres")
	cur = conn.cursor()
	print ('Připojen k databázi')
except:
	sys.exit("Připojení k databázi selhalo")
	
try:
	print ('Spouštění Firefoxu...')
	driver = webdriver.Firefox()
	driver.set_window_position(-9999, -9999)
	driver.get("http://rodos.vsb.cz/Road.aspx?road=D2")
except:
	sys.exit("Spouštění Firefoxu selhalo")


k = 1
repeats = 15

for i in range(1, 288):
	oy = i + 1
	cur.execute("UPDATE d2_sk_time SET stav_time = (SELECT stav_time FROM d2_sk_time WHERE id = " + str(oy) + ") WHERE id = " + str(i) + ";")
	conn.commit()

strx = ""
for i in range(1, 288):
	oy = i + 1
	if (i == 287):
		strx = strx + " stav_" + str(i) + " = stav_" + str(oy)
		break
	strx = strx + " stav_" + str(i) + " = stav_" + str(oy) + ","
	
cur.execute("UPDATE d2 SET" + strx + " WHERE usek between 1 and 60;")
conn.commit()

	
cur.execute("UPDATE d2_sk_time SET stav_time = (now() + (20 * interval '1 second')) WHERE id = 288;")
conn.commit()

start_time = time.time()
extra_time = time.time()

while True:
	print ('-' * 20)
	try:
		ele = driver.find_element_by_xpath("//*[@id='countdownPanel']/a/img")
		ele.click()
		sleep_time = 20 - ((time.time() - start_time))
		if sleep_time > 0:
			time.sleep(sleep_time)
			start_time = time.time()
		else:
			start_time = time.time()
		if (k - 1) % repeats == 0 and not k < repeats:
			cur.execute("UPDATE d2 SET" + strx + " WHERE usek between 1 and 60;")
			conn.commit()
						
			for i in range(1, 288):
				oy = i + 1
				cur.execute("UPDATE d2_sk_time SET stav_time = (SELECT stav_time FROM d2_sk_time WHERE id = " + str(oy) + ") WHERE id = " + str(i) + ";")
				conn.commit()
			cur.execute("UPDATE d2_sk_time SET stav_time = (now()) WHERE id = 288;")
			
			conn.commit()
			k = 1

		
		html_source = driver.page_source
		soup = BeautifulSoup(html_source, 'lxml')
		#driver.quit()
		
		
		jk = 1
		jb = 1
		list1= []
		indx = []
		lost = [1, 3, 4, 5, 6, 11, 12, 13, 14, 15, 16, 17, 25, 26, 27, 28, 29, 30, 31, 32, 41, 42, 43, 44, 49, 50, 51, 52, 53, 54]
		lost1 = [2, 7, 8, 9, 10, 18, 19, 20, 21, 22, 23, 24, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 47, 48, 55, 56, 57, 58, 59, 60]
		
		for i in (soup.find_all("tspan", {"id" : re.compile("tspan_Label_\w*")})):
			if re.match("^[0-9]+$", (str(i.getText()))) is not None:
				if (str(i.parent.get('fill'))) == '#5f5f5f':
					list1.append(i.getText())
					
		ij = 1
		if len(list1) == 60:	
		
			for i in list1:
				
				if ij in lost1:
					if (k == 1 or (k - 1) % repeats == 0 and not k < repeats):
						cur.execute("UPDATE d2 SET stav_288 = 0 WHERE usek = " + str(jk) + ";")
						cur.execute("UPDATE d2 SET stav_288 = "+ i +" WHERE usek = " + str(jk) + ";")
						conn.commit()
						print ("Úsek: " + str(jk) + " = " + str(i) + " km/h")
						jk += 1
					else:
						cur.execute("UPDATE d2 SET stav_288 = CAST(round((" + i + " + (SELECT stav_288 FROM d2 WHERE usek = " + str(jk) + ")) / 2) AS int) WHERE usek = " + str(jk) + ";")
						conn.commit()
						print ("Úsek: " + str(jk) + " = " + str(i) + " km/h")
						jk += 1
					
				if ij in lost:
					if (k == 1 or (k - 1) % repeats == 0 and not k < repeats):
						cur.execute("UPDATE d2 SET stav_288 = 0 WHERE usek = " + str(61 - jb) + ";")
						cur.execute("UPDATE d2 SET stav_288 = "+ i +" WHERE usek = " + str(61 - jb) + ";")
						conn.commit()
						print ("Úsek: " + str(61 - jb) + " = " + str(i) + " km/h")
						jb += 1
					else:
						cur.execute("UPDATE d2 SET stav_288 = CAST(round((" + i + " + (SELECT stav_288 FROM d2 WHERE usek = " + str(61 - jb) + ")) / 2) AS int) WHERE usek = " + str(61 - jb) + ";")
						conn.commit()
						print ("Úsek: " + str(61 - jb) + " = " + str(i) + " km/h")
						jb += 1
					
				ij += 1
			
			print ("Počet úseků: " + str(len(list1)))	
		else:
			print ("Chyba - počet úseků jen: " + str(len(list1)))
			
		k += 1
	except:
		print ("Driver error")
		try:
			driver.get("http://rodos.vsb.cz/Road.aspx?road=D2")
			time.sleep(20)
			k += 1
			if (k - 1) % repeats == 0 and not k < repeats:
				cur.execute("UPDATE d2 SET" + strx + " WHERE usek between 1 and 60;")
				conn.commit()
							
				for i in range(1, 288):
					oy = i + 1
					cur.execute("UPDATE d2_sk_time SET stav_time = (SELECT stav_time FROM d2_sk_time WHERE id = " + str(oy) + ") WHERE id = " + str(i) + ";")
					conn.commit()
				cur.execute("UPDATE d2_sk_time SET stav_time = (now()) WHERE id = 288;")
				
				conn.commit()
				k = 1

		except:
			time.sleep(1)