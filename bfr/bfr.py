# -*- coding: utf-8 -*-

from flask import Flask, request, jsonify
import requests, ast, bike_finder
bike_finder.init()
app = Flask(__name__)

@app.route('/api/labels', methods=['GET', 'POST'])
def collection():
    if request.method == 'GET':
        pass  # Handle GET all Request
    elif request.method == 'POST':
        try:
            data = request.form["file"]
            print('Analyzing bikes...');
            bike_info = bike_finder.extract(ast.literal_eval(data))
            return str(bike_info)
        except:
            return str({
                "bikefound": False,
                "rack": "",
                "basket": "",
                "frame": "",
                "color": "",
                "light": ""
	        })
        
@app.route("/")
def hello():
    return "<h1 style='color:blue'>Hasdfhah!</h1>"
if __name__ == '__main__':
    #bike_finder.init()
    #print ('lol')
    app.debug = True
    app.run()
    print('ADRIAAAN')
