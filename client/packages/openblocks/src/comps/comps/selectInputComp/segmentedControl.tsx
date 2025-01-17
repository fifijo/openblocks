import { Segmented as AntdSegmented } from "antd";
import { BoolCodeControl } from "comps/controls/codeControl";
import { stringExposingStateControl } from "comps/controls/codeStateControl";
import { ChangeEventHandlerControl } from "comps/controls/eventHandlerControl";
import { LabelControl } from "comps/controls/labelControl";
import { SelectInputOptionControl } from "comps/controls/optionsControl";
import { styleControl } from "comps/controls/styleControl";
import { SegmentStyle, SegmentStyleType } from "comps/controls/styleControlConstants";
import styled, { css } from "styled-components";
import { UICompBuilder } from "../../generators";
import { CommonNameConfig, NameConfig, withExposingConfigs } from "../../generators/withExposing";
import { formDataChildren, FormDataPropertyView } from "../formComp/formDataConstants";
import {
  SelectInputInvalidConfig,
  selectInputValidate,
  SelectInputValidationChildren,
  SelectInputValidationSection,
} from "./selectInputConstants";
import { Section, sectionNames } from "openblocks-design";
import { hiddenPropertyView, disabledPropertyView } from "comps/utils/propertyUtils";
import { trans } from "i18n";

const getStyle = (style: SegmentStyleType) => {
  return css`
    &.ant-segmented:not(.ant-segmented-disabled) {
      background-color: ${style.background};

      &,
      .ant-segmented-item-selected,
      .ant-segmented-thumb,
      .ant-segmented-item:hover,
      .ant-segmented-item:focus {
        color: ${style.text};
        border-radius: ${style.radius};
      }

      .ant-segmented-item-selected,
      .ant-segmented-thumb {
        background-color: ${style.indicatorBackground};
      }
    }

    &.ant-segmented,
    .ant-segmented-item-selected {
      border-radius: ${style.radius};
    }
  `;
};

const Segmented = styled(AntdSegmented)<{ $style: SegmentStyleType }>`
  width: 100%;
  height: 32px; // keep the height unchanged when there are no options
  ${(props) => props.$style && getStyle(props.$style)}
`;

export const SegmentChildrenMap = {
  value: stringExposingStateControl("value"),
  label: LabelControl,
  disabled: BoolCodeControl,
  onEvent: ChangeEventHandlerControl,
  options: SelectInputOptionControl,
  style: styleControl(SegmentStyle),

  ...SelectInputValidationChildren,
  ...formDataChildren,
};

export const SegmentedControlBasicComp = (function () {
  return new UICompBuilder(SegmentChildrenMap, (props) =>
    props.label({
      required: props.required,
      style: props.style,
      children: (
        <Segmented
          block
          disabled={props.disabled}
          value={props.value.value}
          $style={props.style}
          onChange={(value) => {
            props.value.onChange(value.toString());
            props.onEvent("change");
          }}
          options={props.options
            .filter((option) => option.value !== undefined && !option.hidden)
            .map((option) => ({
              label: option.label,
              value: option.value,
              disabled: option.disabled,
            }))}
        />
      ),
      ...selectInputValidate(props),
    })
  )
    .setPropertyViewFn((children) => (
      <>
        <Section name={sectionNames.basic}>
          {children.options.propertyView({})}
          {children.value.propertyView({ label: trans("prop.defaultValue") })}
        </Section>
        <FormDataPropertyView {...children} />
        {children.label.getPropertyView()}

        <Section name={sectionNames.interaction}>
          {children.onEvent.getPropertyView()}
          {disabledPropertyView(children)}
        </Section>

        <SelectInputValidationSection {...children} />

        <Section name={sectionNames.layout}>{hiddenPropertyView(children)}</Section>
        <Section name={sectionNames.style}>{children.style.getPropertyView()}</Section>
      </>
    ))
    .build();
})();

export const SegmentedControlComp = withExposingConfigs(SegmentedControlBasicComp, [
  new NameConfig("value", trans("selectInput.valueDesc")),
  SelectInputInvalidConfig,
  ...CommonNameConfig,
]);
