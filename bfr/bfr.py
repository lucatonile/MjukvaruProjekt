# -*- coding: utf-8 -*-

from flask import Flask, request, jsonify
import requests, ast, bike_finder

app = Flask(__name__)

@app.route('/api/labels', methods=['GET', 'POST'])
def collection():
    if request.method == 'GET':
        pass  # Handle GET all Request
    elif request.method == 'POST':
        data = request.form["file"]
        print('Analyzing bikes...');
        bike_info = bike_finder.extract(ast.literal_eval(data))
        return str(bike_info)


        
if __name__ == '__main__':
    bike_finder.init()
    #app.debug = True
    app.run(threaded=True)