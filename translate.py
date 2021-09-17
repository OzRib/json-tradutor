import sys
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

ARGS = sys.argv
to_translate = ARGS[1]

path = ChromeDriverManager().install()
browser = webdriver.Chrome(executable_path=path)
browser.get('https://translate.google.pt')

# er8xn is the input textarea
input_field = browser.find_element_by_class_name('er8xn')

# putting work to translate in input textarea
input_field.send_keys(to_translate)
