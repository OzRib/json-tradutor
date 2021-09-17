import sys
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

ARGS = sys.argv
to_translate = ARGS[1]

path = ChromeDriverManager().install()
browser = webdriver.Chrome(executable_path=path)
browser.get('https://translate.google.pt')
