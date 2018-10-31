import React, { Component } from 'react';
import * as ReactFauxDOM from 'react-faux-dom'
import * as d3 from 'd3';
import * as sizeme from 'react-sizeme';

function splitCaps(word){
    return word;
   const caps = word.match(/[A-Z]*[^A-Z]+/g); // this doesn't catch ~~~REM~~~~
   let s = "";
   var index = 0;
    for( var w of caps ) {
        index += w.length;
        s += w + " ";
    }
    return s;
}

class Chart extends Component {
    constructor(props) {
        super(props);

        this.renderChart = this.renderChart.bind(this);
    }
    
    renderChart(){    
        /*let dataRaw = sample.pop();
        let deleteKeys = ['SleepDay', 'TotalSleepRecords'];
        deleteKeys.forEach(e => delete dataRaw[e]);
        
        let data = [];
        for(var name in dataRaw){
            data.push({name:name.slice(6), minutes:dataRaw[name]})
        }*/
        let { width } = this.props.size;
        var fauxDiv = ReactFauxDOM.createElement('div'); 
        d3.select(fauxDiv).classed("chart", "true")
        
        const axisNameOrder = [ "MinutesAsleep", "TimeAwake", "MinutesLight", "MinutesDeep", "MinutesREM" ]
        
        let svg = d3.select(fauxDiv).append('svg')
                                        .attr('margin', 0)
                                        .attr('padding', 0)
                                        .attr('width', width )
                                        .attr('height', 500)
                                        .classed("chart", true);

        var margin = {top: 20, right: 30, bottom: 30, left: 20},
            width_ = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        var x = d3.scaleBand().rangeRound([0, width_]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);
        
        var chart = svg.append('g')
                            .attr("transform", "translate(" + margin.right + "," + margin.top+")");

        var data = this.props.data.map((d) => {
            d.minutes = +d.minutes;
            return d;  
        });
        
        //x.domain(data.map(function(d) { return d.name.slice(5) }));
        x.domain( axisNameOrder.map((item)  =>{ return splitCaps(item) } ));
        y.domain([0, d3.max(data, function(d) { return d.minutes; })]);

        chart.append('g')
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        chart.append('g')
            .call(d3.axisLeft(y).ticks(10))
            .attr("class", "axis axis--y") 
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Mins Asleep")
            .attr("fill", "darkGrey");

        chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x( splitCaps(d.name.slice(5))) })
            .attr("y", function(d) { return y(d.minutes); })
            .attr("width", x.bandwidth() - 10)
            .attr("height", function(d) { return height - y(d.minutes); })
            .attr("fill", "black");
            
        return fauxDiv
    }

    render() {
        let fauxDiv = this.renderChart();
        return (
            fauxDiv.toReact()
        );
    }
}
  
export default  sizeme.withSize()(ReactFauxDOM.withFauxDOM(Chart));

/*
d3.json(ddd)
            .then((data) => {
                return data.map((d) => {
                    d.minutes = +d.minutes;
                    return d;  
                });
            })
            .then((data) => {
                x.domain(data.map(function(d) { return d.name; }));
                y.domain([0, d3.max(data, function(d) { return d.minutes; })]);

                svg.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                svg.append("g")
                    .attr("class", "axis axis--y")
                    .call(d3.axisLeft(y).ticks(10))
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .attr("text-anchor", "end")
                    .text("Frequency");

                svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.name); })
                    .attr("y", function(d) { return y(d.minutes); })
                    .attr("width", x.bandwidth())
                    .attr("height", function(d) { return height - y(d.minutes); });
            })
            .catch((error) => {
                    throw error;
            }
            */