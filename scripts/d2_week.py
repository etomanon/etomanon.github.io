from selenium import webdriver
import time
from bs4 import BeautifulSoup
import lxml
import re
import psycopg2
import sys
import datetime


try:
	conn = psycopg2.connect("dbname=spatial user=postgres password=postgres")
	cur = conn.cursor()
	print ('Připojen k databázi')
except:
	sys.exit("Připojení k databázi selhalo")

try:
	print ('Spouštění Firefoxu...')
	driver = webdriver.Firefox()
	#driver.set_window_position(9999, 9999)
	driver.get("http://rodos.vsb.cz/Road.aspx?road=D2")
except:
	sys.exit("Spouštění Firefoxu selhalo")

k = 1
repeats = 14

# posun casu v databázi
for i in range(1, 288):
	oy = i + 1
	cur.execute("UPDATE den_cas_1 SET stav_cas = (SELECT stav_cas FROM den_cas_1 WHERE id = " + str(oy) + ") WHERE id = " + str(i) + ";")
	conn.commit()

# posun hodnot v databázi
strx = ""
for i in range(1, 288):
	oy = i + 1
	if (i == 287):
		strx = strx + " stav_" + str(i) + " = stav_" + str(oy)
		break
	strx = strx + " stav_" + str(i) + " = stav_" + str(oy) + ","
	
cur.execute("UPDATE den_1 SET" + strx + " WHERE usek between 1 and 60;")
conn.commit()

# cas spusteni skriptu
t = datetime.datetime.today()
future = datetime.datetime(t.year,t.month,t.day, 23, 59, 41)
time.sleep((future-t).seconds)


start_time = time.time()

loop_end = datetime.datetime.today() + datetime.timedelta(seconds=320)
cur.execute("UPDATE den_cas_1 SET stav_cas = (now() + (20 * interval '1 second')) WHERE id = 288;")
conn.commit()

skip = False
day = 8
day_repeat = 1
time.sleep(10)
while True:
	print ('-' * 20)
	try:
		if (day_repeat == 288):
			day_repeat = 0
			day += 1
		if (day > 14):
			sys.exit("Konec!")
		try:
			if (skip):
				#ele = driver.find_element_by_xpath("//*[@id='countdownPanel']/a/img")
				#ele.click()
				driver.refresh()
		except:
			print ("Neaktualizováno")
		skip = True
		sleep_time = 20 - ((time.time() - start_time))
		if sleep_time > 0:
			time.sleep(sleep_time)
			start_time = time.time()
		else:
			start_time = time.time()

		if (k - 1) % repeats == 0 and not k < repeats:
			cur.execute("UPDATE den_" + str(day) + " SET" + strx + " WHERE usek between 1 and 60;")
			conn.commit()
			day_repeat += 1
						
			for i in range(1, 288):
				oy = i + 1
				cur.execute("UPDATE den_cas_" + str(day) + " SET stav_cas = (SELECT stav_cas FROM den_cas_" + str(day) + " WHERE id = " + str(oy) + ") WHERE id = " + str(i) + ";")
				conn.commit()
			time.sleep((loop_end - datetime.datetime.today()).seconds)
			loop_end = loop_end + datetime.timedelta(seconds=300)
			start_time = time.time()
			cur.execute("UPDATE den_cas_" + str(day) + " SET stav_cas = (now() + (1 * interval '1 second')) WHERE id = 288;")
			conn.commit()
			k = 1
		
		html_source = driver.page_source
		soup = BeautifulSoup(html_source, 'lxml')
		
		
		jk = 1
		jb = 1
		list1= []
		indx = []
		indexList = [1, 3, 4, 5, 6, 11, 12, 13, 14, 15, 16, 17, 25, 26, 27, 28, 29, 30, 31, 32, 41, 42, 43, 44, 49, 50, 51, 52, 53, 54]
		indexList1 = [2, 7, 8, 9, 10, 18, 19, 20, 21, 22, 23, 24, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 47, 48, 55, 56, 57, 58, 59, 60]
		
		for i in (soup.find_all("tspan", {"id" : re.compile("tspan_Label_\w*")})):
			if re.match("^[0-9]+$", (str(i.getText()))) is not None:
				if (str(i.parent.get('fill'))) == '#5f5f5f':
					list1.append(i.getText())
					
		ij = 1
		if len(list1) == 60:	
		
			for i in list1:
				
				if ij in indexList1:
					if (k == 1 or (k - 1) % repeats == 0 and not k < repeats):
						cur.execute("UPDATE den_" + str(day) + " SET stav_288 = 0 WHERE usek = " + str(jk) + ";")
						cur.execute("UPDATE den_" + str(day) + " SET stav_288 = "+ i +" WHERE usek = " + str(jk) + ";")
						conn.commit()
						print ("Úsek: " + str(jk) + " = " + str(i) + " km/h")
						jk += 1
					else:
						cur.execute("UPDATE den_" + str(day) + " SET stav_288 = CAST(round((" + i + " + (SELECT stav_288 FROM den_" + str(day) + " WHERE usek = " + str(jk) + ")) / 2) AS int) WHERE usek = " + str(jk) + ";")
						conn.commit()
						print ("Úsek: " + str(jk) + " = " + str(i) + " km/h")
						jk += 1
					
				if ij in indexList:
					if (k == 1 or (k - 1) % repeats == 0 and not k < repeats):
						cur.execute("UPDATE den_" + str(day) + " SET stav_288 = 0 WHERE usek = " + str(61 - jb) + ";")
						cur.execute("UPDATE den_" + str(day) + " SET stav_288 = "+ i +" WHERE usek = " + str(61 - jb) + ";")
						conn.commit()
						print ("Úsek: " + str(61 - jb) + " = " + str(i) + " km/h")
						jb += 1
					else:
						cur.execute("UPDATE den_" + str(day) + " SET stav_288 = CAST(round((" + i + " + (SELECT stav_288 FROM den_" + str(day) + " WHERE usek = " + str(61 - jb) + ")) / 2) AS int) WHERE usek = " + str(61 - jb) + ";")
						conn.commit()
						print ("Úsek: " + str(61 - jb) + " = " + str(i) + " km/h")
						jb += 1
					
				ij += 1
			
			print ("Počet úseků: " + str(len(list1)))	
		else:
			print ("Chyba - počet úseků jen: " + str(len(list1)))
			raise Exception('Chyba - počet úseků != 60')
			
		k += 1

	except Exception as e: 
		print ("ERROR:")
		print (e)
		print(str(e.__class__.__name__))
		try:
			if (day_repeat == 288):
				day_repeat = 0
				day += 1
			if (day > 14):
				sys.exit("Konec!")
			driver.get("http://rodos.vsb.cz/Road.aspx?road=D2")
			k = 14
			if (k - 1) % repeats == 0 and not k < repeats:
				cur.execute("UPDATE den_" + str(day) + " SET" + strx + " WHERE usek between 1 and 60;")
				conn.commit()
				day_repeat += 1
				
				for i in range(1, 288):
					oy = i + 1
					cur.execute("UPDATE den_cas_" + str(day) + " SET stav_cas = (SELECT stav_cas FROM den_cas_" + str(day) + " WHERE id = " + str(oy) + ") WHERE id = " + str(i) + ";")
					conn.commit()
				time.sleep((loop_end - datetime.datetime.today()).seconds)
				loop_end = loop_end + datetime.timedelta(seconds=300)
				start_time = time.time()
				cur.execute("UPDATE den_cas_" + str(day) + " SET stav_cas = (now() + (1 * interval '1 second')) WHERE id = 288;")
				conn.commit()
				k = 1

		except:
			time.sleep(1)