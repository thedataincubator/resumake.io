/**
 * @flow
 */

import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import { lighten, darken, rgba } from 'polished'
import { withRouter, type Location } from 'react-router-dom'
import { connect } from 'react-redux'
import { arrayMove } from 'react-sortable-hoc'
import styled from 'styled-components'
import SortableList from './SortableList'
import { PrimaryButton } from '../../../common/components'
import { setSectionOrder, setProgress } from '../actions'
import { fetchIfNeededAndResetFormToSavedState, saveFellowData, publishPDF } from '../../tdi/actions'
import { previewMatchesFormData } from '../../tdi/selectors'
import { sizes, colors } from '../../../common/theme'
import type { Section } from '../../../common/types'
import type { State } from '../../../app/types'
import { Heading } from '../../../features/form/components/sections/Section'
import { uploadFileAndGenerateResume } from '../../../features/form/actions'

const Aside = styled.aside`
  position: fixed;
  left: 0;
  top: ${sizes.header};
  width: ${sizes.sideNav};
  height: calc(100% - ${sizes.header});
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid ${colors.borders};

  @media screen and (max-width: 850px) {
    display: none;
  }
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 25px;
`

const RButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: inherit;
  font-size: inherit;
  text-align: center;
  text-decoration: none;
  width: 175px;
  max-width: 100%;
  height: 45px;
  margin-top: 15px;
  background: transparent;
  color: white;
  border-radius: 100px;
  border: 1px solid ${darken(0.1, colors.primary)};
  box-shadow: 0 0 0 0 ${rgba(colors.primary, 0.7)};
  transition: all 0.4s ease;

  &:disabled {
    filter: saturate(0);
    color: #ccc;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(
      40deg,
      ${darken(0.5, colors.primary)},
      ${darken(0.3, colors.primary)}
    );
    animation: none;
    cursor: pointer;
  }

  &:active {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06), 0 2px 40px rgba(0, 0, 0, 0.16);
    border-color: ${lighten(0.15, colors.primary)};
    color: ${lighten(0.15, colors.primary)};
  }

  &:focus {
    outline: none;
  }
`

const RFButton = RButton.extend`
  background: linear-gradient(
    40deg,
    ${darken(0.3, colors.primary)},
    ${colors.primary}
  );

  &:hover:enabled {
    background: linear-gradient(
      40deg,
      ${darken(0.4, colors.primary)},
      ${colors.primary}
    );
  }
`

const RButtonLink = RButton.withComponent('a')
const RButtonLabel = RButton.withComponent('label')

const Rule = styled.hr`
  height: 1px;
  color: ${colors.borders};
  width: 175px;
  max-width: 100%;
  margin: 30px;
`

type Props = {
  location: Location,
  sections: Array<Section>,
  setSectionOrder: (
    newSectionOrder: Array<Section>,
    currSection: Section
  ) => void,
  setProgress: (newSectionOrder: Array<Section>, currSection: Section) => void,
  fetchIfNeededAndResetFormToSavedState: *,
  saveFellowData: *,
  disablePublish: boolean
}

class SideNav extends Component<Props> {
  onSortStart = () => {
    this.toggleGrabCursor()
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { location, sections, setSectionOrder, setProgress } = this.props
    const newSectionOrder = arrayMove(sections, oldIndex, newIndex)
    const currSection: Section = (location.pathname.slice(11): any)

      setSectionOrder(newSectionOrder, currSection)
    setProgress(newSectionOrder, currSection)
    this.toggleGrabCursor()
  }

  // Pretty hacky, but meh
  toggleGrabCursor() {
    document.body && document.body.classList.toggle('grabbing')
  }

  handleSaveFellowDataClick = () => {
    const { sections, formValues, saveFellowData } = this.props
    saveFellowData({ ...formValues, sections })
  }

  handleResetFormToSavedStateClick = () => {
    const { fetchIfNeededAndResetFormToSavedState } = this.props
    fetchIfNeededAndResetFormToSavedState()
  }

  handleUploadPdfClick = () => {
    const { publishPDF } = this.props
    publishPDF()
  }

  handleFileUpload = async (e) => {
    const { uploadFileAndGenerateResume } = this.props
    const file = e.target.files[0]

    await uploadFileAndGenerateResume(file)
    const { jsonUpload } = this.props

    if (jsonUpload.status !== 'success') {
      window.alert("Error uploading JSON file")
      console.log(jsonUpload.errMessage)
    }
  }

  render() {
    const { sections, previewUpdated, jsonURL } = this.props

    return (
      <Aside>
        <div style={{overflow: "auto", "min-height": "100%"}}>
          <Nav>
            <SortableList
              useDragHandle
              lockToContainerEdges
              lockAxis="y"
              items={sections}
              onSortStart={this.onSortStart}
              onSortEnd={this.onSortEnd}
            />
            <span
              data-tip="Preview is up to date."
              data-tip-disable={!previewUpdated}
            >
              <RFButton style={{ marginTop: '0' }} type="submit" form="resume-form" disabled={previewUpdated}>
                Preview
              </RFButton>
            </span>
            <Rule />
            <Heading>
              Resume Book
            </Heading>
            <RButton onClick={this.handleResetFormToSavedStateClick}>
              Load Data from Profile
            </RButton>
            <RButton onClick={this.handleSaveFellowDataClick}>
              Save Data to Profile
            </RButton>
            {/* NOTE: disabled button avoids the tooltip without the wrapping spans. */}
            {/* See: https://github.com/wwayne/react-tooltip/issues/304 */}
            <span
              style={{ marginTop: '15px' }} // Aligning the tooltip
              data-tip="Preview must be updated before publishing."
              data-tip-disable={previewUpdated}>
              <RFButton style={{ marginTop: '0px' }} disabled={!previewUpdated} onClick={this.handleUploadPdfClick}>
                Save and Publish
              </RFButton>
            </span>
            <Rule />
            <Heading>
              Local versions
            </Heading>
            { previewUpdated ?
              <RButtonLink href={jsonURL} download="resume.json">
                Download JSON
              </RButtonLink>
            :
              <RButton disabled data-tip="Update preview to download JSON.">
                Download JSON
              </RButton>
            }
            <RButtonLabel htmlFor="import-json">
              Upload JSON
            </RButtonLabel>
            <input
              id="import-json"
              type="file"
              style={{display: "none"}}
              onChange={this.handleFileUpload}
            />
            <ReactTooltip type="info" effect="solid" place="right" />
          </Nav>
        </div>
      </Aside>
    )
  }
}

function mapState(state: State) {
  return {
    sections: state.progress.sections,
    formValues: state.form.resume.values,
    previewUpdated: previewMatchesFormData(state),
    jsonURL: state.preview.data.url,
    jsonUpload: state.form.resume.jsonUpload
  }
}

const mapActions = {
  setSectionOrder,
  setProgress,
  fetchIfNeededAndResetFormToSavedState,
  saveFellowData,
  publishPDF,
  uploadFileAndGenerateResume
}

const ConnectedSideNav = connect(mapState, mapActions)(SideNav)

export default withRouter(ConnectedSideNav)
