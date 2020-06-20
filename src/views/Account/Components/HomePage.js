import React, { PureComponent } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  Brush,
} from "recharts";

import { connect } from "react-redux";
import { Segment, Header, Message, Statistic } from "semantic-ui-react";

//
import "../style.scss";

const CustomizedTooltip = (props) => {
  const { label, payload, active } = props;

  if (active) {
    return (
      <div className="home-page-tooltip">
        <div>Date : {label} </div>
        <div>Completed lessons : {payload[0].payload.lessonsCompleted} </div>
      </div>
    );
  }
  return null;
};

class HomePage extends PureComponent {
  state = {
    dateChartFormat: [],
    allLessons: 0,
  };

  componentDidMount() {
    const { authUser } = this.props.sessionState;
    // console.log(authUser,'authUser')
    let dateChartFormat = [];
    let allLessons = 0;
    Object.values(authUser.lessonsCompleted).forEach((date) => {
      // add lesson
      allLessons += 1;
      // transform from miliseconds to date
      const isoDate = new Date(date).toISOString().slice(0, 10);
      // check if current date exists in array already
      const findIndex = dateChartFormat.findIndex(
        (obj) => obj.date === isoDate
      );
      // if don't exist push in array
      if (findIndex === -1) {
        dateChartFormat.push({
          date: isoDate,
          lessonsCompleted: 1,
        });
      } else {
        dateChartFormat[findIndex].lessonsCompleted += 1;
      }
    });

    this.setState({ dateChartFormat, allLessons });
  }
  render() {
    const { dateChartFormat, allLessons } = this.state;

    return (
      <>
        <Segment>
          <Header as="h3" textAlign="center">
            Statistics
          </Header>
        </Segment>
        <Segment>
          <Header as="h3" textAlign="center">
            Your Progress
          </Header>
          {/* <Statistic className="home-page-statistic" size={"mini"} color="teal">
          <Statistic.Label>Lessons Completed </Statistic.Label>
          <Statistic.Value>{allLessons}</Statistic.Value>
        </Statistic> */}
          {!!dateChartFormat.length ? (
            <ResponsiveContainer width={"100%"} height={300}>
              <AreaChart
                data={dateChartFormat}
                margin={{ top: 50, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="date" />
                <YAxis
                  dataKey="lessonsCompleted"
                  allowDecimals={false}
                  label={{
                    value: "Completed  Lessons",
                    angle: -90,
                  }}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={<CustomizedTooltip />} />
                <Area
                  type="monotone"
                  dataKey="lessonsCompleted"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
                <Brush dataKey="date" height={30} stroke="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Message
              info
              className="home-page-message"
              header={"You haven't done any lesson yet."}
              size="huge"
            />
          )}
        </Segment>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { sessionState } = state;
  return { sessionState };
};

export default connect(mapStateToProps, null)(HomePage);
