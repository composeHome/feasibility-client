import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { withStateHandlers } from 'recompose'
import ContentEditable from 'react-contenteditable'
import gql from 'graphql-tag'

const Cost = ({ name, price }) => (
  <li>
    &nbsp;&nbsp;
    <ContentEditable
      html={name}
      tagName='span'
      onChange={() => {}}
    />
    {`: `} 
    <ContentEditable
      html={(price / 100).toString()}
      tagName='span'
      onChange={() => {}}
    />
  </li>
)

const Category = withStateHandlers({
  expanded: true
}, {
  toggleExpand: ({ expanded }) => () => ({
    expanded: !expanded
  })
})(({ id, name, total, categories, costs, expanded, toggleExpand }) => (
  <li key={`category-${id}`}>
    <style jsx>{`
      ul {
        list-style-type: none;
      }

      li > span {
        content: "  ";
      }

      li > span.name {
        cursor: pointer;
        user-select: none;
      }

      span.name:before {
        font-weight: bold;
      }

      span.name.expanded:before {
        content: "- ";
      }

      span.name:before {
        content: "+ ";
      }

      span.name.expanded > span {
        opacity: 0.5;
      }
    `}</style>
    <span className={`name ${expanded ? 'expanded' : ''}`} onClick={toggleExpand}>{name}: <span>{total / 100}</span></span>
    {
      expanded && (
        <span>
          <ul>
            {
              costs.map(cost =>
                <Cost key={`cost-${cost.id}`} {...cost} />
              )
            }
          </ul>
          { 
            categories.length > 0 && (
              <CostTree categories={categories} />
            )
          }
        </span>
      )
    }
  </li>
))

const CostTree = ({ categories }) => (
  <ul>
    <style jsx>{`
      ul {
        list-style-type: none;
      }
    `}</style>
    {
      categories.map(category =>
        <Category key={`category-${category.id}`} {...category} />
      )
    }
  </ul>
)

CostTree.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.string,
    total: PropTypes.number
  }))
}

const fragments = {
  cost: gql`
    fragment CostCostTree on Cost {
      id
      name
      price
    }
  `,
  get category() {
    return gql`
      fragment CategoryCostTree on Category {
        id
        name
        total
        costs {
          ...CostCostTree
        }
      }
      ${this.cost}
    `
  }
}

const categories = gql`
  query categories {
    categories {
      ...CategoryCostTree
      categories {
        ...CategoryCostTree
        categories {
          ...CategoryCostTree
        }
      }
    }
  }
  ${fragments.category}
`

export default graphql(categories, {
  props: ({ data }) => ({
    categories: data.categories
  })
})(CostTree)
