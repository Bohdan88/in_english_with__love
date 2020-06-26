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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { connect } from "react-redux";
import { Segment, Header, Message, List } from "semantic-ui-react";

//
import "../style.scss";
import { CATEGORY_ID } from "../../../constants";

const PIE_CHART_COLORS = ["#0088FE", "#00C49F"];

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
    dataAreaChart: [],
    dataPieChart: [],
    allLessons: 0,
  };

  componentDidMount() {
    const { authUser } = this.props.sessionState;

    let dataAreaChart = [];
    let dataPieChart = [];
    let allLessons = 0;

    if (authUser.lessonsCompleted) {
      Object.entries(authUser.lessonsCompleted).forEach(
        ([subCategory, date]) => {
          // transform from miliseconds to date
          const isoDate = new Date(date).toISOString().slice(0, 10);

          // area chart array-------------------------

          // add lesson
          allLessons += 1;

          // check if current date exists in array already
          const dateIndex = dataAreaChart.findIndex(
            (obj) => obj.date === isoDate
          );
          // if don't exist push in array
          if (dateIndex === -1) {
            dataAreaChart.push({
              date: isoDate,
              lessonsCompleted: 1,
            });
          } else {
            dataAreaChart[dateIndex].lessonsCompleted += 1;
          }
          //--------------------------------

          // pie chart array -------------------

          // identify lessons subCategory
          const subCategoryNameIndex = subCategory.lastIndexOf(CATEGORY_ID);

          /* Slice value by index and add length of the connected word which is "-subCategory-".
             So we have to slice  it from the end subCategory, 
             that is why we add its length to find out its ending index
          */

          const transformedName = subCategory.slice(
            subCategoryNameIndex + CATEGORY_ID.length
          );

          if (subCategoryNameIndex !== -1) {
            // check if current subcategory exists in array already
            const subCategoryIndex = dataPieChart.findIndex(
              (obj) => obj.subCategory === transformedName
            );

            if (subCategoryIndex === -1) {
              dataPieChart.push({
                subCategory: transformedName,
                lessonsCompleted: 1,
              });
            } else {
              dataPieChart[subCategoryIndex].lessonsCompleted += 1;
            }
          }
        }
      );

      this.setState({
        dataAreaChart: dataAreaChart.sort((a, b) =>
          new Date(a.date) > new Date(b.date) ? 1 : -1
        ),
        allLessons,
        dataPieChart,
      });
    }
  }
  render() {
    const { dataAreaChart, dataPieChart, allLessons } = this.state;
    const { authUser } = this.props.sessionState;

    return (
      <>
        <Segment>
          <Header as="h3" textAlign="center">
            Overview
          </Header>
          {!!dataPieChart.length ? (
            <div className="home-page-overview">
              <List size="huge">
                <List.Item>
                  <List.Icon name="user" />
                  <List.Content className="capitalize">
                    Username: <b>{authUser.username}</b>
                  </List.Content>
                </List.Item>

                <List.Item>
                  <List.Icon name="mail outline" />
                  <List.Content>
                    Email: <b> {authUser.email}</b>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="sort numeric up" />
                  <List.Content>
                    Completed lessons: <b>{allLessons}</b>
                  </List.Content>
                </List.Item>
              </List>
              <div className="home-page-pie-chart">
                <PieChart width={300} height={250}>
                  <Pie
                    isAnimationActive={false}
                    data={dataPieChart}
                    innerRadius={65}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="lessonsCompleted"
                  >
                    {dataPieChart.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Legend
                    payload={dataPieChart.map((item, index) => ({
                      id: item.subCategory,
                      type: "circle",
                      color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
                      value: `${item.subCategory} (${item.lessonsCompleted})`,
                    }))}
                  />
                </PieChart>
              </div>
            </div>
          ) : (
            <Message
              info
              className="home-page-message"
              header={"You haven't done any lesson yet."}
              size="huge"
            />
          )}
        </Segment>
        <Segment>
          <Header as="h3" textAlign="center">
            Your Progress
          </Header>

          {!!dataAreaChart.length ? (
            <ResponsiveContainer width={"100%"} height={300}>
              <AreaChart
                data={dataAreaChart}
                margin={{ top: 50, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="date" angle={-50} dy={25} height={80} />
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
                <Brush height={30} stroke="#8884d8" />
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
