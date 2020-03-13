import React from 'react';
import * as Common from './common.js';
import NavBar from './NavBar.js';
import Info from './Info.js';
import Skill from './Skill.js';
import './App.css';

class App extends React.Component
{
  state = {
    "enemyIndex": null,
    "lvl": null,
    "enemyData": null,
    "skillData": null,
    "SpottedStage": null,
    "isStageExpanded": false
  };

  constructor(props)
  {
    console.log("constructor");
    super(props);
    this.loadAreaData(this.props.enemyIndex);
  }

  loadData = async (enemyIndex) =>
  {
    let enemyData = await Common.loadEnemyData(enemyIndex);
    let skillDataList = await Common.loadSkillDataList();
    let lvl = this.state.lvl || this.props.enemyLVL;

    let searchresult = new Map();
    this.areadatalist.forEach(areadata =>
    {
      let searcharea = areadata.stage.filter(stageelem => stageelem.wave.some(waveelem => waveelem.enemylist.some(pos => pos.index === enemyIndex)))
        .map(stage =>
        {
          let obj = { "title": stage.title };
          ('name' in stage) && (obj.name = stage.name);
          return obj;
        });
      if (searcharea.length > 0)
      {
        if (areadata.title.includes("Daily"))
        {
          searchresult.has("Daily") ? searchresult.get("Daily").push(...searcharea) : searchresult.set("Daily", searcharea);
        }
        else searchresult.set(areadata.title, searcharea);
      }
    });

    this.setState({
      "enemyIndex": enemyIndex,
      "enemyData": enemyData,
      "lvl": parseInt(lvl),
      "skillData": enemyData.skills.map(index => skillDataList[index]),
      "SpottedStage": searchresult
    });
  };

  loadAreaData = async enemyIndex =>
  {
    const arealist = ["1", "2", "3", "4", "5", "6", "Daily1", "Daily2", "Daily3", "Ev11", "Ev21", "Ev22", "Ev23", "Ev31", "Ev41", "Ev51", "Ev52", "Ev61", "Ev62"];
    this.areadatalist = await Promise.all(arealist.map(areaindex => Common.loadAreaData(areaindex)));
    this.loadData(enemyIndex);
  }

  handleLvlChange = (action) =>
  {
    let lvl = this.state.lvl;
    if (action === '+')
    {
      lvl++;
    }
    else if (action === '-')
    {
      lvl>1 && lvl--;
    }
    else
    {
      lvl = parseInt((action.length===0||action<1)?1:action);
    }
    this.setState(prevstate => ({
      ...prevstate,
      "lvl": lvl
    }));
  }

  handleEnemyChange = index =>
  {
    this.loadData(index);
  }

  toggleExpandStage = () =>
  {
    this.setState((prevstate) => ({ ...prevstate, "isStageExpanded": prevstate.isStageExpanded ^ true }));
  };

  isBottom(el)
  {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  trackScrolling = () =>
  {
    const wrappedElement = document.querySelector(".content");
    if (this.isBottom(wrappedElement))
    {
      console.log('header bottom reached');
      document.removeEventListener('scroll', this.trackScrolling);
    }
  };

  componentDidMount()
  {
    console.log("componentDidMount")
    document.addEventListener('scroll', this.trackScrolling);
  }

  componentDidUpdate()
  {
    console.log("componentDidUpdate")
  }

  render()
  {
    console.log("renderApp")
    return (
      this.state.enemyData == null ? <div>Loading...</div>
        :
        <div className="container">
          <div className="nav-container">
            <NavBar onEnemyChange={this.handleEnemyChange} />
          </div>
          <div className="content-container">
            <div className="content">
              <Info data={this.state} onLvlChange={this.handleLvlChange} />
              <Skill data={this.state} index={this.props.enemyIndex} />
              <Stage SpottedStage={this.state.SpottedStage} isStageExpanded={this.state.isStageExpanded} toggleExpandStage={this.toggleExpandStage} />
            </div>
          </div>
        </div>
    );
  }
}

const Stage = props =>
{
  return (
    <div className="stage">
      <div className="stage-header" onClick={props.toggleExpandStage}>등장 스테이지<i className="material-icons">{(props.isStageExpanded ? "expand_less" : "expand_more")}</i></div>
      <div className={"stage-inner" + (props.isStageExpanded ? "" : " stage-inner-hidden")}>
        {
          props.SpottedStage.size===0 ? <table key="stagetable"><thead><tr><th>영원의 전장 (업데이트 예정)</th></tr></thead></table> :
          Array.from(props.SpottedStage, ([key, value]) => (
            <table key={key}>
              <thead>
                {key.includes("Daily") ? "" : <tr><th colSpan={value.length}>{key + (isNaN(key) ? "" : "지역")}</th></tr>}
              </thead>
              <tbody>
                <tr>{value.map(stage => (<td key={stage.title}><a href={"https://lastoriginmap.github.io/stage.html?stagetitle=" + stage.title}>{stage.name || stage.title}</a></td>))}</tr>
              </tbody>
            </table>
          ))
        }
      </div>
    </div>
  );
}

export default App;
