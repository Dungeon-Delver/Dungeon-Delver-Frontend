import * as React from "react"
import "./CategoryContainer.css"

import CategorySelector from "../CategorySelector/CategorySelector"

export default function CategoryContainer({ category }) {
  return (
    <div className={category.category}>
      What {category.category} do you want to play with?
      <div className="catergory-container">
        <ul className="ks-cboxtags">
          {category.selectors.map(item => (
            <CategorySelector key={item} selector={item} activeSelector={category.activeSelector} handleOnSelectorPress={() => category.setActiveSelector(item)}/>
          ))}
        </ul>
      </div>
    </div>
  )
}