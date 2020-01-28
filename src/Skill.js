import React from 'react';

class Skill extends React.Component
{
  state = {
    "displayedSkill": 0
  };

  displayedEnemyName = this.props.data.enemyData.name;

  changeDisplayedSkill = (index) =>
  {
    this.setState({ "displayedSkill": index });
  }

  componentDidUpdate()
  {
    console.log(this.props.data.enemyData.name)
    console.log(this.displayedEnemyName)
    if(this.props.data.enemyData.name !== this.displayedEnemyName)
    {
      this.displayedEnemyName = this.props.data.enemyData.name;
      this.setState({ "displayedSkill": 0 });
    }
  }

  render()
  {
    const displayedSkill = this.state.displayedSkill;
    const propsdata = this.props.data;
    const enemyData = propsdata.enemyData;
    const skillData = propsdata.skillData;
    const lvl = propsdata.lvl;
    let btnlist = skillData.map((data, index) => (
      <button className={`btn skill-${data.type} ${displayedSkill === index ? "active" : ""}`} key={"skillbtn" + index} onClick={() => this.changeDisplayedSkill(index)}>
        <img className={"skill-icon"} src={`images/SkillIcon/${data.img}_${data.type}.png`} alt={`${data.img}_${data.type} icon`} />
      </button>
    ));
    btnlist.push(
      <button className={`btn btn-info skill-active ${displayedSkill === skillData.length ? "active" : ""}`} key="skillinfobtn" onClick={() => this.changeDisplayedSkill(skillData.length)}>
        <img className="skill-icon info-icon" src="images/info.png" alt="info icon" />
      </button>
    );

    let skillNavWrapClass = "skill-nav-wrap skill-active";
    if (displayedSkill < skillData.length)
    {
      skillNavWrapClass = "skill-nav-wrap skill-" + skillData[displayedSkill].type;
    }

    return (
      <div className="skill-container">
        <div className="skill-header">
          <h3>보유 스킬</h3>
        </div>
        <div className={skillNavWrapClass}>
          <nav className="skill-nav">
            {btnlist}
          </nav>
        </div>
        {
          displayedSkill < skillData.length ?
            <SkillView skilldata={skillData[displayedSkill]} ATK={enemyData.ATK} lvl={lvl} /> :
            <InfoView enemyInfo={enemyData.info} />
        }
      </div>
    );
  }
}

class SkillView extends React.Component
{
  render()
  {
    const skilldata = this.props.skilldata;
    const ATK = this.props.ATK.base + this.props.ATK.increment * (this.props.lvl - 1);

    let attr = "normal"
    if (skilldata.attr !== undefined) { attr = skilldata.attr; }

    let skillpower = ""
    var m = skilldata.description.match(/\$\((\d+\.*\d*)\)/);
    if (m != null)
    {
      let skillrate = skilldata.description.match(/\$\((\d+\.*\d*)\)/)[1];
      skillpower = Math.floor(ATK * skillrate);
      (skillpower<1) && (skillpower=1);
    }

    let area = [];
    if (!skilldata.areadata.some(el => { return el < 1; }))
    {
      for (let i = 0; i < skilldata.areadata.length; i++)
      {
        area[skilldata.areadata[i] - 1] = { backgroundColor: "rgb(255, 213, 0)" };
      }
    }
    else
    {
      for (let i = 0; i < 9; i++)
      {
        let rgb = [255, Math.round((213 - 128) / 0.5 * (skilldata.areadata[i] - 0.5) + 128), 0];
        if (skilldata.areadata[i] === 0) { rgb = [45, 45, 45]; }
        area[i] = { backgroundColor: `rgb(${rgb})` };
      }
    }

    return (
      <div className="skillview-container">
        <div className="skill-name">
          <img className='icon-attr' src={"images/" + attr + ".png"} alt={attr + " icon"} /><h5> Lv. 1</h5> <h3> {skilldata.name} </h3>
        </div>
        <div className="skill-area">
          <table>
            <tbody>
              <tr>
                <td style={area[6]}></td><td style={area[7]}></td><td style={area[8]}></td>
              </tr>
              <tr>
                <td style={area[3]}></td><td style={area[4]}></td><td style={area[5]}></td>
              </tr>
              <tr>
                <td style={area[0]}></td><td style={area[1]}></td><td style={area[2]}></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="skill-description">
          <p>{skilldata.description.replace(/\$\((\d+\.*\d*)\)/g, (skillpower)+" ($1배)").split('<br>').map((line, i) => <span key={i}>{line}<br /></span>)}</p>
        </div>
        <div className="skill-range">
          사정거리 {skilldata.range}<br />AP-{skilldata.AP}
        </div>
      </div>
    );
  }
}


class InfoView extends React.Component
{
  render()
  {
    return (
      <div className="skillview-container info-description">
        <h3>대상 정보</h3>
        <p>{this.props.enemyInfo.split('<br>').map((line, i) => <span key={i}>{line}<br /></span>)}</p>
      </div>
    );
  }
}

export default Skill;