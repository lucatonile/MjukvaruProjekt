# -*- coding: utf-8 -*-
"""
Created on Wed Nov 21 13:16:48 2018
@author: dippson2
"""
from keras.models import load_model
from imageai.Detection import ObjectDetection
import numpy as np
import os, cv2, sys, json
from PIL import Image
import PIL
import io
from flask import Flask, request, jsonify
import requests
import tensorflow as tf

def extract(pic): 

    returnObject = {
        "bikefound": False,
        "rack": "",
        "basket": "",
        "frame": "",
        "color": "",
        "lamp": ""
    }

    pic = np.array(pic,dtype=np.uint8)
    picture_stream = io.BytesIO(pic)

    with graph.as_default():
        returned_image, detections, extracted_objects =  \
        detector.detectCustomObjectsFromImage(custom_objects=custom, input_image = picture_stream, \
                                                                                            input_type = "stream",
                                                                                            output_type="array", extract_detected_objects=True,  minimum_percentage_probability=30)

    if len(detections) != 0:
        returnObject["bikefound"] = True  
        print("Found bike")
    else:
        print("Found to many or to few bikes on image")
        print("Bikes found: " + str(len(detections)))
        #send returnObject
        return returnObject

    #Resize and reshape bike image
    
    img_data_list = []
    bike_img = extracted_objects[0]
    bike_img=cv2.cvtColor(bike_img, cv2.COLOR_BGR2RGB)
    bike_img=cv2.resize(bike_img, (256,256))
    img_data_list.append(bike_img)

    img_data_list = np.array(img_data_list)
    img_data_list = img_data_list.astype('float32')
    img_data_list /= 255


    #Predictions
    
    #rack
    with graph.as_default():
        rack = RACKDETECTION_MODEL.predict(img_data_list)
    if rack[0][1] > 0.5:
        returnObject["rack"] = "yes"
        print("yes rack")
    else: 
        returnObject["rack"] = "no"
        print("No rack")
    
    #basket
    with graph.as_default():
        basket = BASKETDETECTION_MODEL.predict(img_data_list)
    if rack[0][1] > 0.5:
        returnObject["basket"] = "yes"
        print("yes basket")
    else: 
        returnObject["basket"] = "no"
        print("No basket")
    
    #lamp
    with graph.as_default():
        lamp = LAMPDETECTION_MODEL.predict(img_data_list)
    if rack[0][1] > 0.5:
        returnObject["lamp"] = "yes"
        print("yes lamp")
    else: 
        returnObject["lamp"] = "no"
        print("No lamp")
    
    #frame
    with graph.as_default():
        frame = FRAMEDETECTION_MODEL.predict(img_data_list)
    if frame[0][0] > 0.5:
        returnObject["frame"] = "female"
    
    elif frame[0][1] > 0.5:
        returnObject["frame"] = "male" 
    
    elif frame[0][2] > 0.5:
        returnObject["frame"] = "special"

    elif frame[0][3] > 0.5:
        returnObject["frame"] = "sport"

    #color
    with graph.as_default():
        color = COLORSDETECTION_MODEL.predict(img_data_list)
    if color[0][0] > 0.5:
        returnObject["color"] = "black"
    
    if color[0][1] > 0.5:
        returnObject["color"] = "blue"
    
    if color[0][2] > 0.5:
        returnObject["color"] = "gray"
    
    if color[0][3] > 0.5:
        returnObject["color"] = "green"
    
    if color[0][4] > 0.5:
        returnObject["color"] = "orange"
    
    if color[0][5] > 0.5:
        returnObject["color"] = "pink"
    
    if color[0][6] > 0.5:
        returnObject["color"] = "purple"
    
    if color[0][7] > 0.5:
        returnObject["color"] = "red"
    
    if color[0][8] > 0.5:
        returnObject["color"] = "silver"
    
    if color[0][8] > 0.5:
        returnObject["color"] = "white"

    if color[0][8] > 0.5:
        returnObject["color"] = "yellow"

    return returnObject

def init():
    print("Loading models...")
    global RACKDETECTION_MODEL, LAMPDETECTION_MODEL, BASKETDETECTION_MODEL, FRAMEDETECTION_MODEL, COLORSDETECTION_MODEL, graph, detector, custom
    # TODO: MODELS_PATH is an environment variable
    MODELS_PATH = 'C:/Users/lucasle/Desktop/MP/LHFork_2/MjukvaruProjekt/bfr/models/'
    #models/
    PATH_BIKEDETECTION_MODEL = MODELS_PATH + 'resnet50_coco_best_v2.0.1.h5'
    PATH_RACKDETECTION_MODEL = MODELS_PATH + 'rack/Adam_10_epochs_4layers.h5' #Adam_10_epochs_4layers.h5
    PATH_LAMPDETECTION_MODEL = MODELS_PATH + 'lamp/Adam_3_epochs_4layers_lamp.h5'
    PATH_FRAMEDETECTION_MODEL = MODELS_PATH + 'frame/Adam_5_epochs_4layers_frame.h5'
    PATH_BASKETDETECTION_MODEL = MODELS_PATH + 'basket/Adam_5_epochs_4layers_bakset.h5'
    PATH_COLORSDETECTION_MODEL = MODELS_PATH + 'colors/Adam_5_epochs_4layers_colors.h5'

    #Models
    RACKDETECTION_MODEL = load_model(PATH_RACKDETECTION_MODEL)
    LAMPDETECTION_MODEL = load_model(PATH_LAMPDETECTION_MODEL)
    BASKETDETECTION_MODEL = load_model(PATH_BASKETDETECTION_MODEL)
    FRAMEDETECTION_MODEL = load_model(PATH_FRAMEDETECTION_MODEL)
    COLORSDETECTION_MODEL = load_model(PATH_COLORSDETECTION_MODEL)

    detector = ObjectDetection()
    detector.setModelTypeAsRetinaNet()
    detector.setModelPath(PATH_BIKEDETECTION_MODEL)
    detector.loadModel()
    custom = detector.CustomObjects(bicycle=True)
    
    graph = tf.get_default_graph()
    print("Loading done!")