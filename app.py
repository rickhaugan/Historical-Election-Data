import sqlalchemy
import pandas as pd
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
from keys import sqlkey
from sqlalchemy import and_
from flask_cors import cross_origin

engine = create_engine('postgresql://postgres:'+sqlkey+'@localhost:5432/election_data')
connection = engine.connect()

county_sql = "select * from edata_county where state in ('Arizona', 'Florida', 'Michigan', 'North Carolina', 'Pennsylvania') and year = 2016"
# county_sql = "select * from edata_county and year = 2016"
state_sql = "select * from edata_state where state in ('Arizona', 'Florida', 'Michigan', 'North Carolina', 'Pennsylvania') and year = 2016"

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# print(engine.table_names)
# Save reference to the table
County = Base.classes.edata_county
State = Base.classes.edata_state

app = Flask(__name__)

@app.route("/")
@cross_origin()
def welcome():
    cnty = "/api/v1.0/county"
    stt = "/api/v1.0/state"    
    return (
        f"""
Choose County or State Endpoint <br>
<a href='{cnty}'>{cnty}</a><br>
<a href='{stt}'>{stt}</a><br>
"""
    )

@app.route("/api/v1.0/county")
@cross_origin()
def county_elections():
    # Create our session (link) from Python to the DB
    countyData = pd.read_sql(county_sql, connection)
    county_data_dictionary = countyData.to_dict('records')

    return jsonify(county_data_dictionary)

@app.route("/api/v1.0/state")
def state_elections():    
    state_data = pd.read_sql(state_sql, connection)
    state_data_dictionary = state_data.to_dict('records')

    return jsonify(state_data_dictionary)

if __name__ == '__main__':
    app.run(debug=True)
