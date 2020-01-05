import { Node } from 'graphsource';

export type KeyboardNavDirection = 'ArrowDown' | 'ArrowUp' | 'ArrowRight' | 'ArrowLeft';

export const flattenNodeTree = (nodes: Node<{}>[], unfoldedNodeIdList: string[]): Node<{}>[] => {
  return nodes.reduce((accumulator: Node<{}>[], node: Node<{}>) => {
    if (unfoldedNodeIdList.includes(node.id)) {
      return [...accumulator, node, ...flattenNodeTree(node.inputs || [], unfoldedNodeIdList)];
    } else {
      return [...accumulator, node];
    }
  }, []);
};

export const getNextSelectedNode = (
  flatNodeList: Node<{}>[],
  direction: KeyboardNavDirection,
  selectedNode?: Node,
): Node<{}> | null => {
  if (direction === 'ArrowRight') {
    if (selectedNode && selectedNode.inputs && selectedNode.inputs.length > 0) {
      return selectedNode.inputs[0];
    }
    return null;
  }
  if (direction === 'ArrowLeft') {
    if (selectedNode && selectedNode.outputs && selectedNode.outputs.length > 0) {
      return selectedNode.outputs[0];
    }
    return null;
  }

  const fallbackSelectedNode = flatNodeList[direction === 'ArrowDown' ? 0 : flatNodeList.length - 1];

  if (!selectedNode) {
    return fallbackSelectedNode;
  }

  const currentLevelNodeIndex = flatNodeList.findIndex((n) => n.id === selectedNode.id);
  if (currentLevelNodeIndex > -1) {
    return flatNodeList[currentLevelNodeIndex + (direction === 'ArrowDown' ? 1 : -1)] || fallbackSelectedNode;
  }

  return fallbackSelectedNode;
};

export const getQueryMatchingNodeTree = (node: Node<{}>, phrase: string): Boolean => {
  return (
    Boolean(node.name.toLowerCase().match(phrase.toLowerCase())) ||
    Boolean(node.inputs?.some((nodeInput) => getQueryMatchingNodeTree(nodeInput, phrase)))
  );
};

export const getSearchExpandTree = <T extends any>(node: Node<T>, phrase: string): Node<T> | null => {
  const currentNodeMatches = Boolean(node.name.toLowerCase().match(phrase.toLowerCase()));
  const matchingInputs = node.inputs
    ?.map((nodeInput) => getSearchExpandTree(nodeInput, phrase))
    .filter((n) => n !== null) as Node<T>[];

  return currentNodeMatches || matchingInputs.length ? { ...node, inputs: matchingInputs || [] } : null;
};

export const getSelectedExpandTree = <T extends any>(node: Node<T>, selectedNodes: Node<T>[]): Node<T> | null => {
  const currentNodeMatches = selectedNodes.map((sn) => sn.id).includes(node.id);
  const matchingInputs = node.inputs
    ?.map((nodeInput) => getSelectedExpandTree(nodeInput, selectedNodes))
    .filter((n) => n !== null) as Node<T>[];

  return currentNodeMatches || matchingInputs.length ? { ...node, inputs: matchingInputs || [] } : null;
};