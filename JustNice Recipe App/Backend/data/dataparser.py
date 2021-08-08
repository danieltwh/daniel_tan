import csv
import os
from pandas import read_excel

cwd = os.getcwd()

def read_csv(csvfilename):
    """
    Reads a csv file and returns a list of lists
    containing rows in the csv file and its entries.
    """
    with open(csvfilename, newline='\n') as csvfile:
        rows = [row for row in csv.reader(csvfile)]
    return rows

# rows = read_excel("clean_recipes_excel.xlx")
# print(rows)

