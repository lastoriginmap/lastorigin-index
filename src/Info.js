import React from 'react';
import Tooltip from './Tooltip.js';

class Info extends React.Component
{
  state = {
    "isStatExpanded": false
  }

  toggleExpandStat = () =>
  {
    this.setState((prevstate) => ({ ...prevstate, "isStatExpanded": prevstate.isStatExpanded ^ true }));
  };

  calcLvlValue = (data, lvl) =>
  {
    return Math.floor(data.base + data.increment * (lvl - 1));
  };

  handleLvlPlus = () =>
  {
    this.props.onLvlChange('+');
  };

  handleLvlMinus = () =>
  {
    this.props.onLvlChange('-');
  };

  handleLvlChange = (e) =>
  {
    this.props.onLvlChange(e.target.value);
  };

  render()
  {
    const data = this.props.data;
    const enemyData = data.enemyData;
    const lvl = data.lvl;
    return (
      <div className="info-container">
        <div className="image"><img src={"/images/profile/" + enemyData.img + ".png"} alt={enemyData.img} /></div>
        <div className="type">
          <h4 id="type">{enemyData.type}</h4>
        </div>
        <div className="name">
          <h2 id="name">{enemyData.name}</h2>
        </div>
        <div className="LVL">
          <button className="lvl-change lvl-minus" onClick={this.handleLvlMinus}><i className="material-icons">remove</i></button>
          <div>
            <input className="lvl-header" type="text" value="Lv." readOnly></input>
            <div className="tooltip">
              <input className="lvl-input" type="text" value={lvl} onChange={this.handleLvlChange}></input>
              <div className="tooltip-innertext tooltip-innertext-bottom">값을 직접 입력할 수 있습니다</div>
            </div>
          </div>
          <button className="lvl-change lvl-plus" onClick={this.handleLvlPlus}><i className="material-icons">add</i></button>
        </div>
        <div className="spec-wrap">
          <div className="spec-item spec-item-header" id="HP"><img src="images/icon_HP2.png" alt="HP Icon" /><div>HP</div></div><div class="spec-item" id="HP"><Tooltip tooltipdata={enemyData.HP} isStatExpanded={this.state.isStatExpanded}><span className="tooltip-text" onClick={this.toggleExpandStat}>{this.calcLvlValue(enemyData.HP, lvl)}</span></Tooltip></div>
          <div className="spec-item spec-item-header"></div><div class="spec-item" ></div>
          <div className="spec-item spec-item-header"><img src="images/icon_ATK2.png" alt="ATK Icon" /><div>공격력</div></div><div className="spec-item" id="ATK"><Tooltip tooltipdata={enemyData.ATK} isStatExpanded={this.state.isStatExpanded}><span className="tooltip-text" onClick={this.toggleExpandStat}>{this.calcLvlValue(enemyData.ATK, lvl)}</span></Tooltip></div>
          <div className="spec-item spec-item-header"><img src="images/icon_CRT2.png" alt="CRT Icon" /><div>치명타</div></div><div className="spec-item" id="CRT">{enemyData.CRT} %</div>
          <div className="spec-item spec-item-header"><img src="images/icon_DEF2.png" alt="DEF Icon" /><div>방어력</div></div><div className="spec-item" id="DEF"><Tooltip tooltipdata={enemyData.DEF} isStatExpanded={this.state.isStatExpanded}><span className="tooltip-text" onClick={this.toggleExpandStat}>{this.calcLvlValue(enemyData.DEF, lvl)}</span></Tooltip></div>
          <div className="spec-item spec-item-header"><img src="images/icon_HIT2.png" alt="HIT Icon" /><div>적중률</div></div><div className="spec-item" id="HIT">{enemyData.HIT} %</div>
          <div className="spec-item spec-item-header"><img src="images/icon_AGI.png" alt="AGI Icon" /><div>행동력</div></div><div className="spec-item" id="AGI">{enemyData.AGI}</div>
          <div className="spec-item spec-item-header"><img src="images/icon_DOD2.png" alt="DOD Icon" /><div>회피율</div></div><div className="spec-item" id="DOD">{enemyData.DOD} %</div>
          <div className="spec-item resist-wrap">
            <div className="spec-item resist resist-header">속성 저항</div>
            <div className="spec-item resist" id="fire"><img className="icon-attr" src="images/fire.png" alt="fireicon" /> {enemyData.resist[0]} %</div>
            <div className="spec-item resist" id="ice"><img className="icon-attr" src="images/ice.png" alt="iceicon" /> {enemyData.resist[1]} %</div>
            <div className="spec-item resist" id="electric"><img className="icon-attr" src="images/electric.png" alt="electricicon" /> {enemyData.resist[2]} %</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Info;